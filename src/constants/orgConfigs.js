export default {
  o2: {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: ["sidebar-user"],
    routes: {
      homePage: {
        url: "/"
      }
    },
    display: {
      passCreator: {
        passTypes: ["storeCard"]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "code", rowClassname: "code" },
            { key: "shop", rowClassname: "code" },
            { key: "step", rowClassname: "step" },
            { key: "statusType", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "hasPass", rowClassname: "is-register" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["issuer", "phone"]
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: [],
        extendField: {},
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: []
          }
        ]
      }
    }
  },
  missmp: {
    validate: {
      mobileNumber: [49]
    },
    numberQuestionMap: {
      "1": 1,
      "5": 2,
      "6": 3,
      "7": 4,
      "8": 5,
      "9": 6,
      "10": 7,
      "11": 8
    },
    disabledComponents: [],
    routes: {
      homePage: {
        url: "/",
        // url: "/bases/$DEFAULT_BASE_ID/cases",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: [
          "eventTicket",
          "storeCard",
          "coupon",
          "generic",
          "boardingPass"
        ]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "licensePlate", bold: "yes", rowClassname: "license-plate" },
            { key: "phone", rowClassname: "phone" },
            { key: "issuer", rowClassname: "issuer-name" },
            { key: "createdBy", rowClassname: "created-by" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"],
        updateCase: {
          extraPaths: [
            {
              asDisplay: "KENNZEICHEN",
              value: ["extraParams", "LicensePlate"]
            }
          ]
        }
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: ["LicensePlate", "CaseID", "code"],
        extendField: {
          star: {
            label: "star",
            column: "acti_key",
            format: "star",
            typeChart: "pie"
          },
          ok: {
            label: "listfieldok",
            column: "acti_key",
            format: "s2",
            typeChart: "pie"
          }
        },
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: ["onInvalidated"]
          },
          {
            label: "feedbackstar",
            column: "acti_key:feedbackstar",
            format: "star"
          },
          { label: "testok", column: "acti_key:feedbackok", format: "s2" }
        ]
      }
    }
  },
  bahn: {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: ["sidebar-user"],
    routes: {
      homePage: {
        url: "/",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: ["eventTicket", "storeCard"]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "licensePlate", bold: "yes", rowClassname: "license-plate" },
            { key: "phone", rowClassname: "phone" },
            { key: "issuer", rowClassname: "issuer-name" },
            { key: "createdBy", rowClassname: "created-by" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"]
      },
      Analytic: {
        extra_params: ["LicensePlate", "CaseID", "code"],
        extendField: {
          star: {
            label: "star",
            column: "acti_key",
            format: "star",
            typeChart: "pie"
          },
          ok: {
            label: "listfieldok",
            column: "acti_key",
            format: "s2",
            typeChart: "pie"
          }
        },
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: ["onInvalidated"]
          },
          {
            label: "feedbackstar",
            column: "acti_key:feedbackstar",
            format: "star"
          },
          { label: "testok", column: "acti_key:feedbackok", format: "s2" }
        ]
      }
    }
  },
  org2: {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: ["sidebar-user"],
    routes: {
      homePage: {
        url: "/",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: ["storeCard"]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "licensePlate", bold: "yes", rowClassname: "license-plate" },
            { key: "phone", rowClassname: "phone" },
            { key: "issuer", rowClassname: "issuer-name" },
            { key: "createdBy", rowClassname: "created-by" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"]
      }
    }
  },
  mercedes: {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: ["sidebar-user"],
    routes: {
      homePage: {
        url: "/",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: ["eventTicket", "storeCard", "coupon", "generic"]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"]
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: [],
        extendField: {},
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: []
          }
        ]
      }
    }
  },
  sxsw: {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: ["sidebar-user"],
    routes: {
      homePage: {
        url: "/",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: ["eventTicket", "storeCard", "coupon", "generic"]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"]
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: [],
        extendField: {},
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: []
          }
        ]
      }
    }
  },
  smart: {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: [],
    routes: {
      homePage: {
        url: "/",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: ["storeCard"]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"]
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: [],
        extendField: {},
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: []
          }
        ]
      }
    }
  },
  audi: {
    validate: {
      mobileNumber: [49]
    },
    numberQuestionMap: {
      "5": 1,
      "6": 2,
      "7": 3,
      "8": 4,
      "9": 5,
      "10": 6,
      "11": 7
    },
    disabledComponents: ["sidebar-bases", "sidebar-analytic", "sidebar-user"],
    routes: {
      homePage: {
        url: "/bases/$DEFAULT_BASE_ID/cases",
        component: "Cases"
      }
    },
    defaultSetting: {
      baseId: 4
    },
    display: {
      passCreator: {
        passTypes: ["storeCard"]
      },
      homePage: {
        caseListFields: {
          data: [
            {
              key: "id",
              rowClassname: "ID",
              width: 135,
              type: "linkTag"
            },
            {
              key: "step",
              rowClassname: "step",
              bold: "yes"
            },
            {
              key: "status",
              rowClassname: "status",
              bold: "yes"
            },
            {
              key: "createdDate",
              type: "dateWithFormatTwoRows",
              formatString: "DD/MM/YYYY HH:mm:ss",
              splitBy: " "
            },
            {
              key: "update",
              rowClassname: "update",
              headClassname: "update",
              type: "dateWithFormatTwoRows",
              formatString: "DD/MM/YYYY HH:mm:ss",
              splitBy: " "
            },
            {
              key: "licensePlate",
              rowClassname: "license-plate",
              bold: "yes"
            },
            {
              key: "phone",
              rowClassname: "phone"
            },
            {
              key: "issuer",
              rowClassname: "issuer-name"
            },
            {
              key: "createdBy",
              rowClassname: "created-by"
            }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"],
        updateCase: {
          extraPaths: [
            {
              asDisplay: "KENNZEICHEN",
              value: ["extraParams", "LicensePlate"]
            }
          ]
        }
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        filtersList: [{ name: "Tag", value: [] }, { name: "Base", value: [] }],
        extra_params: [""],
        extendField: {
          star: {
            label: "star",
            column: "acti_key",
            format: "star",
            typeChart: "pie"
          },
          ok: {
            label: "listfieldok",
            column: "acti_key",
            format: "s2",
            typeChart: "pie"
          }
        },
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: []
          },
          { label: "testok", column: "acti_key:feedbackok", format: "s2" },
          {
            label: "feedbackstar",
            column: "acti_key:feedbackstar",
            format: "star"
          }
        ]
      }
    }
  },
  "audi-sport": {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: [],
    routes: {
      homePage: {
        url: "/",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: ["eventTicket", "storeCard"]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"]
      },
      Analytic: {
        extra_params: [],
        extendField: {},
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: []
          }
        ]
      }
    }
  },
  mini: {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: ["sidebar-bases", "sidebar-user"],
    routes: {
      homePage: {
        url: "/bases/$/cases",
        component: "Cases"
      }
    },
    display: {
      passCreator: {
        passTypes: ["storeCard"]
      },
      homePage: {
        caseListFields: {
          type: "default",
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              headClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "licensePlate", bold: "yes", rowClassname: "license-plate" },
            {
              key: "phone",
              rowClassname: "phone"
            },
            { key: "issuer", rowClassname: "issuer-name" },
            { key: "createdBy", rowClassname: "created-by" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"]
      },
      Analytic: {
        extra_params: ["LicensePlate", "CaseID", "code"],
        extendField: {
          star: {
            label: "star",
            column: "acti_key",
            format: "star",
            typeChart: "pie"
          },
          ok: {
            label: "listfieldok",
            column: "acti_key",
            format: "s2",
            typeChart: "pie"
          }
        },
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: ["onInvalidated"]
          },
          {
            label: "feedbackstar",
            column: "acti_key:feedbackstar",
            format: "star"
          },
          { label: "testok", column: "acti_key:feedbackok", format: "s2" }
        ]
      }
    }
  },
  vodafone: {
    validate: {
      mobileNumber: [49]
    },
    disabledComponents: ["sidebar-user"],
    routes: {
      homePage: {
        url: "/"
      }
    },
    display: {
      passCreator: {
        passTypes: ["storeCard"]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "code", rowClassname: "code" },
            { key: "shop", rowClassname: "code" },
            { key: "step", rowClassname: "step" },
            { key: "statusType", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "hasPass", rowClassname: "is-register" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["issuer", "phone"]
      },
      Analytic: {
        extra_params: ["code"],
        extendField: {},
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: ["onInvalidated"]
          }
        ]
      }
    }
  },
  "o2-friends-family": {
    validate: {
      mobileNumber: [49]
    },
    numberQuestionMap: {
      "1": 1,
      "5": 2,
      "6": 3,
      "7": 4,
      "8": 5,
      "9": 6,
      "10": 7,
      "11": 8
    },
    disabledComponents: [],
    routes: {
      homePage: {
        url: "/",
        // url: "/bases/$DEFAULT_BASE_ID/cases",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: [
          "eventTicket",
          "storeCard",
          "coupon",
          "generic",
          "boardingPass"
        ]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "licensePlate", bold: "yes", rowClassname: "license-plate" },
            { key: "phone", rowClassname: "phone" },
            { key: "issuer", rowClassname: "issuer-name" },
            { key: "createdBy", rowClassname: "created-by" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"],
        updateCase: {
          extraPaths: [
            {
              asDisplay: "KENNZEICHEN",
              value: ["extraParams", "LicensePlate"]
            }
          ]
        }
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: ["LicensePlate", "CaseID", "code"],
        extendField: {
          star: {
            label: "star",
            column: "acti_key",
            format: "star",
            typeChart: "pie"
          },
          ok: {
            label: "listfieldok",
            column: "acti_key",
            format: "s2",
            typeChart: "pie"
          }
        },
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: ["onInvalidated"]
          },
          {
            label: "feedbackstar",
            column: "acti_key:feedbackstar",
            format: "star"
          },
          { label: "testok", column: "acti_key:feedbackok", format: "s2" }
        ]
      }
    }
  },
  porsche: {
    validate: {
      mobileNumber: [49]
    },
    numberQuestionMap: {
      "1": 1,
      "5": 2,
      "6": 3,
      "7": 4,
      "8": 5,
      "9": 6,
      "10": 7,
      "11": 8
    },
    disabledComponents: [],
    routes: {
      homePage: {
        url: "/",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: [
          "eventTicket",
          "storeCard",
          "coupon",
          "generic",
          "boardingPass"
        ]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "licensePlate", bold: "yes", rowClassname: "license-plate" },
            { key: "phone", rowClassname: "phone" },
            { key: "issuer", rowClassname: "issuer-name" },
            { key: "createdBy", rowClassname: "created-by" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"],
        updateCase: {
          extraPaths: [
            {
              asDisplay: "KENNZEICHEN",
              value: ["extraParams", "LicensePlate"]
            }
          ]
        }
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: ["LicensePlate", "CaseID", "code"],
        extendField: {
          star: {
            label: "star",
            column: "acti_key",
            format: "star",
            typeChart: "pie"
          },
          ok: {
            label: "listfieldok",
            column: "acti_key",
            format: "s2",
            typeChart: "pie"
          }
        },
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: ["onInvalidated"]
          },
          {
            label: "feedbackstar",
            column: "acti_key:feedbackstar",
            format: "star"
          },
          { label: "testok", column: "acti_key:feedbackok", format: "s2" }
        ]
      }
    }
  },
  "o2-soho": {
    validate: {
      mobileNumber: [49]
    },
    numberQuestionMap: {
      "1": 1,
      "5": 2,
      "6": 3,
      "7": 4,
      "8": 5,
      "9": 6,
      "10": 7,
      "11": 8
    },
    disabledComponents: [],
    routes: {
      homePage: {
        url: "/",
        // url: "/bases/$DEFAULT_BASE_ID/cases",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: [
          "eventTicket",
          "storeCard",
          "coupon",
          "generic",
          "boardingPass"
        ]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "licensePlate", bold: "yes", rowClassname: "license-plate" },
            { key: "phone", rowClassname: "phone" },
            { key: "issuer", rowClassname: "issuer-name" },
            { key: "createdBy", rowClassname: "created-by" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"],
        updateCase: {
          extraPaths: [
            {
              asDisplay: "KENNZEICHEN",
              value: ["extraParams", "LicensePlate"]
            }
          ]
        }
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: ["LicensePlate", "CaseID", "code"],
        extendField: {
          star: {
            label: "star",
            column: "acti_key",
            format: "star",
            typeChart: "pie"
          },
          ok: {
            label: "listfieldok",
            column: "acti_key",
            format: "s2",
            typeChart: "pie"
          }
        },
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: ["onInvalidated"]
          },
          {
            label: "feedbackstar",
            column: "acti_key:feedbackstar",
            format: "star"
          },
          { label: "testok", column: "acti_key:feedbackok", format: "s2" }
        ]
      }
    }
  },
  "o2-video-store": {
    validate: {
      mobileNumber: [49]
    },
    numberQuestionMap: {
      "1": 1,
      "5": 2,
      "6": 3,
      "7": 4,
      "8": 5,
      "9": 6,
      "10": 7,
      "11": 8
    },
    disabledComponents: [],
    routes: {
      homePage: {
        url: "/",
        // url: "/bases/$DEFAULT_BASE_ID/cases",
        component: "Bases"
      }
    },
    display: {
      passCreator: {
        passTypes: [
          "eventTicket",
          "storeCard",
          "coupon",
          "generic",
          "boardingPass"
        ]
      },
      homePage: {
        caseListFields: {
          data: [
            { key: "id", type: "highlight", width: 135, rowClassname: "ID" },
            { key: "step", rowClassname: "step" },
            { key: "status", bold: "yes", rowClassname: "status" },
            {
              key: "update",
              rowClassname: "update",
              type: "distanceInWordsToNow"
            },
            { key: "licensePlate", bold: "yes", rowClassname: "license-plate" },
            { key: "phone", rowClassname: "phone" },
            { key: "issuer", rowClassname: "issuer-name" },
            { key: "createdBy", rowClassname: "created-by" },
            { EXTRA: "KEYCUSTOM", extraType: "linktag", extraLabel: "view" }
          ]
        }
      },
      caseDetailPage: {
        sideBar: ["alternativeId"],
        updateCase: {
          extraPaths: [
            {
              asDisplay: "KENNZEICHEN",
              value: ["extraParams", "LicensePlate"]
            }
          ]
        }
      },
      Analytic: {
        groupByList: ["Date", "Tag", "Base", "Link"],
        analyticFields: ["registration", "deletion", "links"],
        extra_params: ["LicensePlate", "CaseID", "code"],
        extendField: {
          star: {
            label: "star",
            column: "acti_key",
            format: "star",
            typeChart: "pie"
          },
          ok: {
            label: "listfieldok",
            column: "acti_key",
            format: "s2",
            typeChart: "pie"
          }
        },
        extendTotal: [
          {
            label: "default",
            column: "acti_type",
            format: "",
            list: ["onInvalidated"]
          },
          {
            label: "feedbackstar",
            column: "acti_key:feedbackstar",
            format: "star"
          },
          { label: "testok", column: "acti_key:feedbackok", format: "s2" }
        ]
      }
    }
  },
  default: {
    validate: {
      mobileNumber: [49]
    },
    display: {
      userList: {
        userListFields: ["realname", "email", "role", "active"]
      }
    }
  }
};
