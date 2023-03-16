import axios from "axios";
import config from "../appConfig";
import * as types from "../constants/actionTypes";
import { asyncActionCreator, defaultHeaders } from "./utils";

//const mockPassAnalytic = require("../mock/passAnalytic");
// const MockAdapter = require("axios-mock-adapter");
// let mock = new MockAdapter(axios);
// mock.onGet("/analytic").reply(200, mockPassAnalytic);
const sumbyfield = x => {
  console.log("x", x);

  x.data.map(obj => {
    const objproduct = x.product.get(obj.value[0]) || {};
    const sum = obj.sum + (objproduct[x.name] || 0);
    objproduct[x.name] = sum;
    console.log("sum", sum);
    x.product.set(obj.value[0], objproduct);
    return {};
  });
  return x.product;
};

// const baseID = localStorage.getItem("baseID");
export const fetchListField = asyncActionCreator(
  types.PASS_ANALYTIC,
  params => () => {
    // console.log("fetchListField__state", state);
    return axios
      .get(
        `${config.TSE_API}/base/${params.baseID}/alpha/analytic?start=${
          params.fromTime
        }&end=${params.toTime}`,
        {
          headers: defaultHeaders()
        }
      )
      .then(res => {
        // let fields = [];
        const resdata = res.data.fields || {};
        let fields = Array.from(resdata.fieldname || [], fielddata => {
          return {
            value: fielddata,
            label: fielddata
          };
        });
        console.log("fetchListField", res.data);
        return {
          ...res,
          data: {
            fields: fields || []
          }
        };
      });
  }
);
export const fetchColSum = asyncActionCreator(
  types.COL_ANALYTIC,
  params => () =>
    axios
      .get(
        `${config.TSE_API}/base/${params.baseID}/alpha/analytic?field=${
          params.col
        }&format=${params.format}&start=${params.fromTime}&end=${
          params.toTime
        }`,
        {
          headers: defaultHeaders()
        }
      )
      .then(res => {
        const summary = res.data.summary || {};
        var keys = Object.keys(summary);
        let fields = keys.map(name => {
          return {
            name: name,
            value: summary[name]
          };
        });

        return {
          ...res,
          data: {
            usageData: fields || []
          }
        };
      })
);

export const fetchPassScanRatioAnalytic = asyncActionCreator(
  types.PASS_ANALYTIC,
  params => () => {
    return axios
      .get(
        `${config.TSE_API}/base/${params.baseID}/alpha/analytic?field=${
          params.extraparam
        }&start=${params.fromTime}&end=${params.toTime}`,
        {
          headers: defaultHeaders()
        }
      )
      .then(res => {
        let fields = [];
        const resdata = res.data.fields || {};
        fields = Array.from(resdata.fieldname || [], fielddata => {
          return {
            value: fielddata,
            label: fielddata
          };
        });
        //First time load anlalytic page.
        if (params.extraparam == null || params.extraparam == "") {
          return {
            ...res,
            data: {
              createdCase: 0,
              createdCaseTarget: 0,
              previewedPass: 0,
              previewedPassTarget: 0,
              addedPass: 0,
              addedPassTarget: 0,
              unsubscribedPass: 0,
              textMessageEngagementTime: 0,
              passRegisteredCompletionTime: 0,
              ratingFormResponseTime: 0,
              usageData: [],
              usageField: [],
              fields: fields || []
            }
          };
        }

        const ressummary = res.data.summary || {};
        const onInvalidated = ressummary.onInvalidated || [];
        const onPreviewedPass = ressummary.onPreviewedPass || [];
        const onDownloadedPass = ressummary.onDownloadedPass || [];
        const onCreatedCase = ressummary.onCreatedCase || [];
        // console.log("onInvalidated", onInvalidated);
        // console.log("onPreviewedPass", onPreviewedPass);
        // console.log("onDownloadedPass", onDownloadedPass);
        // console.log("onCreatedCase", onCreatedCase);

        let product = new Map();

        product = sumbyfield({
          data: onInvalidated,
          name: "onInvalidated",
          product: product
        });
        product = sumbyfield({
          data: onPreviewedPass,
          name: "onPreviewedPass",
          product: product
        });
        product = sumbyfield({
          data: onDownloadedPass,
          name: "onDownloadedPass",
          product: product
        });
        product = sumbyfield({
          data: onCreatedCase,
          name: "onCreatedCase",
          product: product
        });

        let usageDatas = [];
        let usageField = [];

        //console.log("fields", fields);
        let sumPreviewedPass = 0;
        let sumDownloadedPass = 0;
        let sumInvalidated = 0;
        let sumCreatedCase = 0;
        //let sumUnsubscribed = 0;

        if (params.value != "") {
          //Pie Chart
          let field = product.get(params.value) || {};
          usageField.push({
            name: "Previewed Pass",
            value: field.onPreviewedPass
          });
          usageField.push({
            name: "onDownloaded Pass",
            value: field.onDownloadedPass
          });
          usageField.push({
            name: "Invalidated",
            value: field.onInvalidated
          });
          for (const usage of product.entries()) {
            if (usage[0] == params.value) {
              sumPreviewedPass += usage[1].onPreviewedPass;
              sumDownloadedPass += usage[1].onDownloadedPass;
              sumInvalidated += usage[1].onInvalidated;
            }
          }
        } else {
          //Colums Chart
          var mapIter = product.keys();
          for (;;) {
            const field = mapIter.next().value;
            if (field == undefined || field == null) {
              break;
            }
            // console.log("product", product, "field", field);
            // console.log("product.get(field)", product.get(field));

            let fielddata = {
              field: field,
              onInvalidated: product.get(field).onInvalidated,
              onPreviewedPass: product.get(field).onPreviewedPass,
              onDownloadedPass: product.get(field).onDownloadedPass,
              onCreatedCase: product.get(field).onCreatedCase
            };
            usageDatas.push(fielddata);
            sumPreviewedPass += product.get(field).onPreviewedPass || 0;
            sumDownloadedPass += product.get(field).onDownloadedPass || 0;
            sumInvalidated += product.get(field).onInvalidated || 0;
            sumCreatedCase += product.get(field).onCreatedCase || 0;
          }
        }
        return {
          ...res,
          data: {
            createdCase: sumCreatedCase,
            createdCaseTarget: sumCreatedCase,
            previewedPass: sumPreviewedPass || 0,
            previewedPassTarget: sumPreviewedPass || 0,
            addedPass: sumDownloadedPass || 0,
            addedPassTarget: sumPreviewedPass || 0,
            unsubscribedPass: sumInvalidated || 0,
            textMessageEngagementTime: 0,
            passRegisteredCompletionTime: 0,
            ratingFormResponseTime: 0,
            usageData: usageDatas || {},
            usageField: usageField || [],
            fields: fields || []
          }
        };
      });
  }
);

export const fetchPassAnalytic = asyncActionCreator(
  types.PASS_ANALYTIC,
  params => () => {
    return axios
      .get(
        `${config.TSE_API}/base/${
          params.baseID
        }/alpha/analytic-chunk?by=day&start=${params.fromTime}&end=${
          params.toTime
        }`,
        {
          headers: defaultHeaders()
        }
      )
      .then(res => {
        let onInvalidated = 0;
        let onPreviewedPass = 0;
        let onDownloadedPass = 0;
        let onCreatedCase = 0;
        let onUnregisteringPass = 0;
        let usageDatas = [];
        const resdata = res.data || [];
        for (let i = 0; i < resdata.length; i++) {
          let fielddata = {
            onInvalidated: resdata[i].summary.onInvalidated,
            onPreviewedPass: resdata[i].summary.onPreviewedPass,
            onDownloadedPass: resdata[i].summary.onDownloadedPass,
            onUnregisteringPass: resdata[i].summary.onUnregisteringPass,
            timestamp: resdata[i].time
          };
          onInvalidated += resdata[i].summary.onInvalidated || 0;
          onPreviewedPass += resdata[i].summary.onPreviewedPass || 0;
          onDownloadedPass += resdata[i].summary.onDownloadedPass || 0;
          onCreatedCase += resdata[i].summary.onCreatedCase || 0;
          onUnregisteringPass += resdata[i].summary.onUnregisteringPass || 0;
          usageDatas.push(fielddata);
        }

        return {
          ...res,
          data: {
            createdCase: onCreatedCase,
            createdCaseTarget: onCreatedCase,
            previewedPass: onPreviewedPass,
            previewedPassTarget: onPreviewedPass,
            addedPass: onDownloadedPass,
            addedPassTarget: onCreatedCase,
            unsubscribedPass: onUnregisteringPass,
            onInvalidatedPass: onInvalidated,
            textMessageEngagementTime: 0,
            passRegisteredCompletionTime: 0,
            ratingFormResponseTime: 1,
            usageDatas: usageDatas
          }
        };
      });
  }
);
export const fetchPassTotalAnalytic = asyncActionCreator(
  types.PASS_ANALYTIC,
  params => () => {
    return axios
      .get(
        `${config.TSE_API}/base/${params.baseID}/alpha/analytic-total?${
          params.querystring
        }start=${params.fromTime}&end=${params.toTime}`,
        {
          headers: defaultHeaders()
        }
      )
      .then(res => {
        return {
          ...res,
          data: res.data.summary || {}
        };
      });
  }
);

export const fetchRantingRpByLine = ({ baseID, fromTime, toTime }) => () => {
  return axios
    .get(
      `${
        config.TSE_API
      }/base/${baseID}/alpha/analytic-star-report-byline?start=${fromTime}&end=${toTime}`,
      {
        headers: defaultHeaders()
      }
    )
    .then(res => {
      const summary = res.data.summary || {};
      let number = Object.keys(summary);
      let fields = number.map(name => {
        let value = summary[name];
        value.name = name;
        return value;
      });

      return {
        ...res,
        data: {
          usageData: fields || []
        }
      };
    })
    .catch(err => err);
};
