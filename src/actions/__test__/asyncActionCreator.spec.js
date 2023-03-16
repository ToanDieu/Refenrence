// import { asyncActionCreator, defaultHeaders } from "../utils";
// import * as types from "../../constants/actionTypes";
// import configureMockStore from "redux-mock-store";
// import MockAdapter from "axios-mock-adapter";
// import thunk from "redux-thunk";
// import axios from "axios/index";

// const middlewares = [thunk];
// const mockStore = configureMockStore(middlewares);

// let mock = new MockAdapter(axios);

// const sampleRes = {
//   createdAt: "2018-04-03T05:40:32.165128Z",
//   currentStep: 2,
//   id: 73,
//   isRegistered: true
// };

// describe("Async actions creator", () => {
//   const fetchCaseList = asyncActionCreator(types.CASE_LIST, params => () =>
//     axios.get("/test", {
//       headers: defaultHeaders(),
//       params
//     })
//   );

//   afterEach(() => {
//     mock.reset();
//   });

//   it("creates SUCCESS action when fetching has been done", () => {
//     mock.onGet("/test").replyOnce(200, sampleRes);

//     const expectedActions = [
//       { type: types.CASE_LIST.REQUEST },
//       { type: types.CASE_LIST.SUCCESS, payload: sampleRes }
//     ];
//     const store = mockStore({});

//     return store.dispatch(fetchCaseList()).then(() => {
//       // return of async actions
//       expect(store.getActions()).toEqual(expectedActions);
//     });
//   });
// });
