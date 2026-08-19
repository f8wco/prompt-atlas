/* 由 scripts/build-rec.js 从 benchmark 原始评测数据自动生成，请勿手改本文件。
   修改数据请重跑 benchmark 或运行: node scripts/build-rec.js (或 npm run build:rec)
   byModel 与 core.json 强一致（构建时校验）；byScene 为跨模型聚合 lift；byModelScene 单元格样本量低（n=6），仅供注脚。 */
var PROMPT_ATLAS_REC = {
  "version": 1,
  "benchmarkVersion": "0.1",
  "runs": [
    "image-baseline-001",
    "image-baseline-002",
    "image-baseline-003",
    "image-baseline-004"
  ],
  "evaluationLines": 2160,
  "models": [
    {
      "id": "doubao-seedream-4-0-250828",
      "short": "Seedream 4.0",
      "family": "doubao"
    },
    {
      "id": "doubao-seedream-4-5-251128",
      "short": "Seedream 4.5",
      "family": "doubao"
    },
    {
      "id": "zhipu-cogview-4",
      "short": "CogView-4",
      "family": "zhipu"
    }
  ],
  "scenes": [
    {
      "id": "portrait",
      "zh": "人像",
      "en": "Portrait"
    },
    {
      "id": "street",
      "zh": "街头",
      "en": "Street"
    },
    {
      "id": "product",
      "zh": "产品",
      "en": "Product"
    },
    {
      "id": "environment",
      "zh": "自然环境",
      "en": "Environment"
    },
    {
      "id": "animal",
      "zh": "动物",
      "en": "Animal"
    },
    {
      "id": "architecture",
      "zh": "建筑",
      "en": "Architecture"
    }
  ],
  "sampleNote": "low",
  "atoms": {
    "close-up": {
      "byModel": {
        "doubao-seedream-4-0-250828": 58,
        "doubao-seedream-4-5-251128": 81,
        "zhipu-cogview-4": 51
      },
      "byScene": {
        "portrait": {
          "lift": 44,
          "n": 18
        },
        "street": {
          "lift": 67,
          "n": 18
        },
        "product": {
          "lift": 44,
          "n": 18
        },
        "environment": {
          "lift": 22,
          "n": 18
        },
        "animal": {
          "lift": 78,
          "n": 18
        },
        "architecture": {
          "lift": 0,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "street": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 33,
            "b": 33,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "environment": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 67,
            "b": 100,
            "lift": -33,
            "n": 6
          },
          "street": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          }
        }
      },
      "flags": {
        "familySplit": 30
      }
    },
    "monochrome": {
      "byModel": {
        "doubao-seedream-4-0-250828": 100,
        "doubao-seedream-4-5-251128": 100,
        "zhipu-cogview-4": 61
      },
      "byScene": {
        "portrait": {
          "lift": 100,
          "n": 18
        },
        "street": {
          "lift": 89,
          "n": 18
        },
        "product": {
          "lift": 67,
          "n": 18
        },
        "environment": {
          "lift": 100,
          "n": 18
        },
        "animal": {
          "lift": 67,
          "n": 18
        },
        "architecture": {
          "lift": 100,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        }
      },
      "flags": {
        "familySplit": 39,
        "strongSwitch": true
      }
    },
    "golden-hour": {
      "byModel": {
        "doubao-seedream-4-0-250828": 80,
        "doubao-seedream-4-5-251128": 78,
        "zhipu-cogview-4": 80
      },
      "byScene": {
        "portrait": {
          "lift": 0,
          "n": 18
        },
        "street": {
          "lift": 22,
          "n": 18
        },
        "product": {
          "lift": 0,
          "n": 18
        },
        "environment": {
          "lift": 78,
          "n": 18
        },
        "animal": {
          "lift": 0,
          "n": 18
        },
        "architecture": {
          "lift": 89,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        }
      }
    },
    "symmetry": {
      "byModel": {
        "doubao-seedream-4-0-250828": 82,
        "doubao-seedream-4-5-251128": 76,
        "zhipu-cogview-4": 50
      },
      "byScene": {
        "portrait": {
          "lift": 100,
          "n": 18
        },
        "street": {
          "lift": 78,
          "n": 18
        },
        "product": {
          "lift": 11,
          "n": 18
        },
        "environment": {
          "lift": 100,
          "n": 18
        },
        "animal": {
          "lift": 56,
          "n": 18
        },
        "architecture": {
          "lift": 56,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          }
        }
      },
      "flags": {
        "familySplit": 32
      }
    },
    "shallow-dof": {
      "byModel": {
        "doubao-seedream-4-0-250828": 66,
        "doubao-seedream-4-5-251128": 78,
        "zhipu-cogview-4": 60
      },
      "byScene": {
        "portrait": {
          "lift": 0,
          "n": 18
        },
        "street": {
          "lift": 22,
          "n": 18
        },
        "product": {
          "lift": 0,
          "n": 18
        },
        "environment": {
          "lift": 0,
          "n": 18
        },
        "animal": {
          "lift": 0,
          "n": 18
        },
        "architecture": {
          "lift": 67,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 33,
            "b": 33,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 67,
            "b": 100,
            "lift": -33,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          }
        }
      }
    },
    "anime": {
      "byModel": {
        "doubao-seedream-4-0-250828": 100,
        "doubao-seedream-4-5-251128": 100,
        "zhipu-cogview-4": 100
      },
      "byScene": {
        "portrait": {
          "lift": 100,
          "n": 18
        },
        "street": {
          "lift": 100,
          "n": 18
        },
        "product": {
          "lift": 100,
          "n": 18
        },
        "environment": {
          "lift": 100,
          "n": 18
        },
        "animal": {
          "lift": 100,
          "n": 18
        },
        "architecture": {
          "lift": 100,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        }
      },
      "flags": {
        "strongSwitch": true
      }
    },
    "volumetric": {
      "byModel": {
        "doubao-seedream-4-0-250828": 83,
        "doubao-seedream-4-5-251128": 90,
        "zhipu-cogview-4": 38
      },
      "byScene": {
        "portrait": {
          "lift": 44,
          "n": 18
        },
        "street": {
          "lift": 44,
          "n": 18
        },
        "product": {
          "lift": 56,
          "n": 18
        },
        "environment": {
          "lift": 0,
          "n": 18
        },
        "animal": {
          "lift": 78,
          "n": 18
        },
        "architecture": {
          "lift": 67,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 67,
            "b": 33,
            "lift": 33,
            "n": 6
          },
          "street": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          }
        }
      },
      "flags": {
        "familySplit": 52
      }
    },
    "rule-of-thirds": {
      "byModel": {
        "doubao-seedream-4-0-250828": 66,
        "doubao-seedream-4-5-251128": 66,
        "zhipu-cogview-4": 47
      },
      "byScene": {
        "portrait": {
          "lift": 0,
          "n": 18
        },
        "street": {
          "lift": 11,
          "n": 18
        },
        "product": {
          "lift": 0,
          "n": 18
        },
        "environment": {
          "lift": -11,
          "n": 18
        },
        "animal": {
          "lift": 0,
          "n": 18
        },
        "architecture": {
          "lift": -11,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 67,
            "b": 100,
            "lift": -33,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 67,
            "b": 67,
            "lift": 0,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 67,
            "b": 100,
            "lift": -33,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          }
        }
      },
      "flags": {
        "whiteout": true
      }
    },
    "macro": {
      "byModel": {
        "doubao-seedream-4-0-250828": 0,
        "doubao-seedream-4-5-251128": 6,
        "zhipu-cogview-4": 6
      },
      "byScene": {
        "portrait": {
          "lift": 0,
          "n": 18
        },
        "street": {
          "lift": 0,
          "n": 18
        },
        "product": {
          "lift": 0,
          "n": 18
        },
        "environment": {
          "lift": 22,
          "n": 18
        },
        "animal": {
          "lift": 0,
          "n": 18
        },
        "architecture": {
          "lift": 0,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          }
        }
      }
    },
    "telephoto": {
      "byModel": {
        "doubao-seedream-4-0-250828": 64,
        "doubao-seedream-4-5-251128": 67,
        "zhipu-cogview-4": 51
      },
      "byScene": {
        "portrait": {
          "lift": -11,
          "n": 18
        },
        "street": {
          "lift": 11,
          "n": 18
        },
        "product": {
          "lift": 0,
          "n": 18
        },
        "environment": {
          "lift": 22,
          "n": 18
        },
        "animal": {
          "lift": 0,
          "n": 18
        },
        "architecture": {
          "lift": 11,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 33,
            "b": 33,
            "lift": 0,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 67,
            "b": 100,
            "lift": -33,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 67,
            "b": 67,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          }
        }
      },
      "flags": {
        "whiteout": true
      }
    },
    "fisheye": {
      "byModel": {
        "doubao-seedream-4-0-250828": 89,
        "doubao-seedream-4-5-251128": 100,
        "zhipu-cogview-4": 82
      },
      "byScene": {
        "portrait": {
          "lift": 89,
          "n": 18
        },
        "street": {
          "lift": 100,
          "n": 18
        },
        "product": {
          "lift": 56,
          "n": 18
        },
        "environment": {
          "lift": 100,
          "n": 18
        },
        "animal": {
          "lift": 100,
          "n": 18
        },
        "architecture": {
          "lift": 89,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          }
        }
      },
      "flags": {
        "strongSwitch": true
      }
    },
    "rim": {
      "byModel": {
        "doubao-seedream-4-0-250828": 66,
        "doubao-seedream-4-5-251128": 75,
        "zhipu-cogview-4": 59
      },
      "byScene": {
        "portrait": {
          "lift": 0,
          "n": 18
        },
        "street": {
          "lift": 11,
          "n": 18
        },
        "product": {
          "lift": 22,
          "n": 18
        },
        "environment": {
          "lift": 11,
          "n": 18
        },
        "animal": {
          "lift": 0,
          "n": 18
        },
        "architecture": {
          "lift": 22,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 67,
            "b": 100,
            "lift": -33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "environment": {
            "a": 67,
            "b": 100,
            "lift": -33,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          }
        }
      }
    },
    "backlit": {
      "byModel": {
        "doubao-seedream-4-0-250828": 75,
        "doubao-seedream-4-5-251128": 74,
        "zhipu-cogview-4": 85
      },
      "byScene": {
        "portrait": {
          "lift": 0,
          "n": 18
        },
        "street": {
          "lift": 44,
          "n": 18
        },
        "product": {
          "lift": 89,
          "n": 18
        },
        "environment": {
          "lift": 0,
          "n": 18
        },
        "animal": {
          "lift": 0,
          "n": 18
        },
        "architecture": {
          "lift": 56,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 67,
            "b": 33,
            "lift": 33,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        }
      }
    },
    "neon": {
      "byModel": {
        "doubao-seedream-4-0-250828": 89,
        "doubao-seedream-4-5-251128": 94,
        "zhipu-cogview-4": 71
      },
      "byScene": {
        "portrait": {
          "lift": 89,
          "n": 18
        },
        "street": {
          "lift": 100,
          "n": 18
        },
        "product": {
          "lift": 56,
          "n": 18
        },
        "environment": {
          "lift": 78,
          "n": 18
        },
        "animal": {
          "lift": 89,
          "n": 18
        },
        "architecture": {
          "lift": 89,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          }
        }
      },
      "flags": {
        "strongSwitch": true
      }
    },
    "teal-orange": {
      "byModel": {
        "doubao-seedream-4-0-250828": 93,
        "doubao-seedream-4-5-251128": 92,
        "zhipu-cogview-4": 83
      },
      "byScene": {
        "portrait": {
          "lift": 78,
          "n": 18
        },
        "street": {
          "lift": 44,
          "n": 18
        },
        "product": {
          "lift": 89,
          "n": 18
        },
        "environment": {
          "lift": 56,
          "n": 18
        },
        "animal": {
          "lift": 78,
          "n": 18
        },
        "architecture": {
          "lift": 44,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          }
        }
      }
    },
    "film-grain": {
      "byModel": {
        "doubao-seedream-4-0-250828": 78,
        "doubao-seedream-4-5-251128": 72,
        "zhipu-cogview-4": 67
      },
      "byScene": {
        "portrait": {
          "lift": 33,
          "n": 18
        },
        "street": {
          "lift": 44,
          "n": 18
        },
        "product": {
          "lift": 22,
          "n": 18
        },
        "environment": {
          "lift": 0,
          "n": 18
        },
        "animal": {
          "lift": 33,
          "n": 18
        },
        "architecture": {
          "lift": 67,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "environment": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          }
        }
      }
    },
    "pastel": {
      "byModel": {
        "doubao-seedream-4-0-250828": 85,
        "doubao-seedream-4-5-251128": 80,
        "zhipu-cogview-4": 90
      },
      "byScene": {
        "portrait": {
          "lift": 0,
          "n": 18
        },
        "street": {
          "lift": 100,
          "n": 18
        },
        "product": {
          "lift": 22,
          "n": 18
        },
        "environment": {
          "lift": 33,
          "n": 18
        },
        "animal": {
          "lift": 56,
          "n": 18
        },
        "architecture": {
          "lift": 89,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        }
      }
    },
    "ink-wash": {
      "byModel": {
        "doubao-seedream-4-0-250828": 100,
        "doubao-seedream-4-5-251128": 100,
        "zhipu-cogview-4": 33
      },
      "byScene": {
        "portrait": {
          "lift": 100,
          "n": 18
        },
        "street": {
          "lift": 67,
          "n": 18
        },
        "product": {
          "lift": 89,
          "n": 18
        },
        "environment": {
          "lift": 67,
          "n": 18
        },
        "animal": {
          "lift": 67,
          "n": 18
        },
        "architecture": {
          "lift": 78,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "product": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "environment": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          }
        }
      },
      "flags": {
        "familySplit": 67
      }
    },
    "blue-hour": {
      "byModel": {
        "doubao-seedream-4-0-250828": 98,
        "doubao-seedream-4-5-251128": 95,
        "zhipu-cogview-4": 75
      },
      "byScene": {
        "portrait": {
          "lift": 100,
          "n": 18
        },
        "street": {
          "lift": 100,
          "n": 18
        },
        "product": {
          "lift": 67,
          "n": 18
        },
        "environment": {
          "lift": 33,
          "n": 18
        },
        "animal": {
          "lift": 100,
          "n": 18
        },
        "architecture": {
          "lift": 67,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          }
        }
      },
      "flags": {
        "strongSwitch": true
      }
    },
    "negative-space": {
      "byModel": {
        "doubao-seedream-4-0-250828": 73,
        "doubao-seedream-4-5-251128": 67,
        "zhipu-cogview-4": 11
      },
      "byScene": {
        "portrait": {
          "lift": 67,
          "n": 18
        },
        "street": {
          "lift": 78,
          "n": 18
        },
        "product": {
          "lift": 11,
          "n": 18
        },
        "environment": {
          "lift": 11,
          "n": 18
        },
        "animal": {
          "lift": 56,
          "n": 18
        },
        "architecture": {
          "lift": 33,
          "n": 18
        }
      },
      "byModelScene": {
        "doubao-seedream-4-0-250828": {
          "portrait": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 100,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "animal": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "architecture": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          }
        },
        "doubao-seedream-4-5-251128": {
          "portrait": {
            "a": 100,
            "b": 33,
            "lift": 67,
            "n": 6
          },
          "street": {
            "a": 100,
            "b": 0,
            "lift": 100,
            "n": 6
          },
          "product": {
            "a": 100,
            "b": 67,
            "lift": 33,
            "n": 6
          },
          "environment": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          },
          "architecture": {
            "a": 67,
            "b": 0,
            "lift": 67,
            "n": 6
          }
        },
        "zhipu-cogview-4": {
          "portrait": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "street": {
            "a": 33,
            "b": 0,
            "lift": 33,
            "n": 6
          },
          "product": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "environment": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "animal": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          },
          "architecture": {
            "a": 0,
            "b": 0,
            "lift": 0,
            "n": 6
          }
        }
      },
      "flags": {
        "familySplit": 62
      }
    }
  }
};
if (typeof module === 'object' && module.exports) { module.exports = PROMPT_ATLAS_REC; }
if (typeof window !== 'undefined') { window.PROMPT_ATLAS_REC = PROMPT_ATLAS_REC; }
