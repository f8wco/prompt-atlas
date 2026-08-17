/* 由 build.ps1 从 core.json 自动生成，请勿手改本文件。
   修改词库请编辑 core.json 后重新运行: pwsh -File build.ps1 */
window.PROMPT_ATLAS = {
    "version":  2,
    "bySlot":  {
                   "lighting":  [
                                    {
                                        "id":  "golden-hour",
                                        "type":  "atom",
                                        "slot":  "lighting",
                                        "modalities":  [
                                                           "image",
                                                           "video"
                                                       ],
                                        "zh":  "黄金时刻",
                                        "en":  "golden hour",
                                        "aliases":  {
                                                        "zh":  [

                                                               ],
                                                        "en":  [

                                                               ]
                                                    },
                                        "score":  {
                                                      "value":  92,
                                                      "status":  "heuristic",
                                                      "confidence":  null,
                                                      "benchmarkVersion":  null,
                                                      "sampleSize":  0,
                                                      "models":  [

                                                                 ],
                                                      "updatedAt":  "2026-08"
                                                  },
                                        "relations":  {
                                                          "hardConflict":  [

                                                                           ],
                                                          "softTension":  [

                                                                          ],
                                                          "redundant":  [

                                                                        ],
                                                          "requires":  [

                                                                       ],
                                                          "implies":  [

                                                                      ],
                                                          "expandsTo":  [

                                                                        ]
                                                      },
                                        "desc":  "日出后/日落前一小时的低角度暖光，人物轮廓自带金边",
                                        "descEn":  "Low-angle warm light of the hour after sunrise / before sunset; faces get a natural golden rim",
                                        "example":  "golden hour light, warm rim on face"
                                    },
                                    {
                                        "id":  "overcast",
                                        "type":  "atom",
                                        "slot":  "lighting",
                                        "modalities":  [
                                                           "image",
                                                           "video"
                                                       ],
                                        "zh":  "阴天柔光",
                                        "en":  "overcast soft light",
                                        "aliases":  {
                                                        "zh":  [

                                                               ],
                                                        "en":  [

                                                               ]
                                                    },
                                        "score":  {
                                                      "value":  88,
                                                      "status":  "heuristic",
                                                      "confidence":  null,
                                                      "benchmarkVersion":  null,
                                                      "sampleSize":  0,
                                                      "models":  [

                                                                 ],
                                                      "updatedAt":  "2026-08"
                                                  },
                                        "relations":  {
                                                          "hardConflict":  [

                                                                           ],
                                                          "softTension":  [

                                                                          ],
                                                          "redundant":  [

                                                                        ],
                                                          "requires":  [

                                                                       ],
                                                          "implies":  [

                                                                      ],
                                                          "expandsTo":  [

                                                                        ]
                                                      },
                                        "desc":  "云层散射的均匀柔光，无硬阴影，肤色干净",
                                        "descEn":  "Even soft light diffused by clouds, no harsh shadows, clean skin tones",
                                        "example":  "overcast soft light, no harsh shadows"
                                    },
                                    {
                                        "id":  "neon",
                                        "type":  "atom",
                                        "slot":  "lighting",
                                        "modalities":  [
                                                           "image",
                                                           "video"
                                                       ],
                                        "zh":  "霓虹光",
                                        "en":  "neon glow",
                                        "aliases":  {
                                                        "zh":  [

                                                               ],
                                                        "en":  [

                                                               ]
                                                    },
                                        "score":  {
                                                      "value":  85,
                                                      "status":  "heuristic",
                                                      "confidence":  null,
                                                      "benchmarkVersion":  null,
                                                      "sampleSize":  0,
                                                      "models":  [

                                                                 ],
                                                      "updatedAt":  "2026-08"
                                                  },
                                        "relations":  {
                                                          "hardConflict":  [

                                                                           ],
                                                          "softTension":  [

                                                                          ],
                                                          "redundant":  [

                                                                        ],
                                                          "requires":  [

                                                                       ],
                                                          "implies":  [

                                                                      ],
                                                          "expandsTo":  [

                                                                        ]
                                                      },
                                        "desc":  "霓虹灯管的多彩光晕，城市夜景标配",
                                        "descEn":  "Colorful glow of neon tubes, a night-city staple",
                                        "example":  "neon glow, pink and cyan lights"
                                    },
                                    {
                                        "id":  "volumetric",
                                        "type":  "atom",
                                        "slot":  "lighting",
                                        "modalities":  [
                                                           "image",
                                                           "video"
                                                       ],
                                        "zh":  "体积光",
                                        "en":  "volumetric light",
                                        "aliases":  {
                                                        "zh":  [

                                                               ],
                                                        "en":  [

                                                               ]
                                                    },
                                        "score":  {
                                                      "value":  72,
                                                      "status":  "heuristic",
                                                      "confidence":  null,
                                                      "benchmarkVersion":  null,
                                                      "sampleSize":  0,
                                                      "models":  [

                                                                 ],
                                                      "updatedAt":  "2026-08"
                                                  },
                                        "relations":  {
                                                          "hardConflict":  [

                                                                           ],
                                                          "softTension":  [

                                                                          ],
                                                          "redundant":  [

                                                                        ],
                                                          "requires":  [

                                                                       ],
                                                          "implies":  [

                                                                      ],
                                                          "expandsTo":  [

                                                                        ]
                                                      },
                                        "desc":  "可见光束（丁达尔效应），氛围感强但强度易失控",
                                        "descEn":  "Visible light beams (Tyndall effect); atmospheric but the intensity can get out of control",
                                        "example":  "volumetric light rays through window"
                                    },
                                    {
                                        "id":  "rembrandt",
                                        "type":  "atom",
                                        "slot":  "lighting",
                                        "modalities":  [
                                                           "image",
                                                           "video"
                                                       ],
                                        "zh":  "伦勃朗光",
                                        "en":  "Rembrandt lighting",
                                        "aliases":  {
                                                        "zh":  [

                                                               ],
                                                        "en":  [

                                                               ]
                                                    },
                                        "score":  {
                                                      "value":  80,
                                                      "status":  "heuristic",
                                                      "confidence":  null,
                                                      "benchmarkVersion":  null,
                                                      "sampleSize":  0,
                                                      "models":  [

                                                                 ],
                                                      "updatedAt":  "2026-08"
                                                  },
                                        "relations":  {
                                                          "hardConflict":  [

                                                                           ],
                                                          "softTension":  [

                                                                          ],
                                                          "redundant":  [

                                                                        ],
                                                          "requires":  [

                                                                       ],
                                                          "implies":  [

                                                                      ],
                                                          "expandsTo":  [

                                                                        ]
                                                      },
                                        "desc":  "侧上方主光在暗侧脸颊形成三角光斑，肖像经典",
                                        "descEn":  "Key light from the upper side creates a triangle patch on the shadow cheek; a portrait classic",
                                        "example":  "Rembrandt lighting, triangle patch on cheek"
                                    },
                                    {
                                        "id":  "rim",
                                        "type":  "atom",
                                        "slot":  "lighting",
                                        "modalities":  [
                                                           "image",
                                                           "video"
                                                       ],
                                        "zh":  "轮廓光",
                                        "en":  "rim light",
                                        "aliases":  {
                                                        "zh":  [

                                                               ],
                                                        "en":  [

                                                               ]
                                                    },
                                        "score":  {
                                                      "value":  84,
                                                      "status":  "heuristic",
                                                      "confidence":  null,
                                                      "benchmarkVersion":  null,
                                                      "sampleSize":  0,
                                                      "models":  [

                                                                 ],
                                                      "updatedAt":  "2026-08"
                                                  },
                                        "relations":  {
                                                          "hardConflict":  [

                                                                           ],
                                                          "softTension":  [

                                                                          ],
                                                          "redundant":  [

                                                                        ],
                                                          "requires":  [

                                                                       ],
                                                          "implies":  [

                                                                      ],
                                                          "expandsTo":  [

                                                                        ]
                                                      },
                                        "desc":  "逆侧光勾勒主体边缘，与背景分离",
                                        "descEn":  "Back-side light outlines the subject\u0027s edge, separating it from the background",
                                        "example":  "rim light outlining the silhouette"
                                    },
                                    {
                                        "id":  "backlit",
                                        "type":  "atom",
                                        "slot":  "lighting",
                                        "modalities":  [
                                                           "image",
                                                           "video"
                                                       ],
                                        "zh":  "逆光剪影",
                                        "en":  "backlit silhouette",
                                        "aliases":  {
                                                        "zh":  [

                                                               ],
                                                        "en":  [

                                                               ]
                                                    },
                                        "score":  {
                                                      "value":  78,
                                                      "status":  "heuristic",
                                                      "confidence":  null,
                                                      "benchmarkVersion":  null,
                                                      "sampleSize":  0,
                                                      "models":  [

                                                                 ],
                                                      "updatedAt":  "2026-08"
                                                  },
                                        "relations":  {
                                                          "hardConflict":  [

                                                                           ],
                                                          "softTension":  [

                                                                          ],
                                                          "redundant":  [

                                                                        ],
                                                          "requires":  [

                                                                       ],
                                                          "implies":  [

                                                                      ],
                                                          "expandsTo":  [

                                                                        ]
                                                      },
                                        "desc":  "主体处于逆光位呈剪影，细节交给轮廓",
                                        "descEn":  "Subject against the light becomes a silhouette; details are left to the contour",
                                        "example":  "backlit silhouette against sunset"
                                    }
                                ],
                   "style":  [
                                 {
                                     "id":  "cinematic",
                                     "type":  "macro",
                                     "slot":  "style",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "电影感",
                                     "en":  "cinematic",
                                     "aliases":  {
                                                     "zh":  [
                                                                "电影质感"
                                                            ],
                                                     "en":  [
                                                                "cinematic look"
                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  55,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [

                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [
                                                                         "shallow-dof",
                                                                         "film-grain",
                                                                         "teal-orange"
                                                                     ]
                                                   },
                                     "desc":  "使用最滥也最模糊的词；建议拆成景深+调色+运镜",
                                     "descEn":  "The most overused and vaguest word; better split into DOF + grade + camera move",
                                     "example":  "cinematic look"
                                 },
                                 {
                                     "id":  "photoreal",
                                     "type":  "atom",
                                     "slot":  "style",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "写实摄影",
                                     "en":  "photorealistic",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  60,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [
                                                                           "anime",
                                                                           "ink-wash",
                                                                           "claymation",
                                                                           "pixel-art"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "逼近真实照片；模型基准线，确定性中等",
                                     "descEn":  "Close to real photos; the model baseline, medium determinism",
                                     "example":  "photorealistic, shot on 35mm"
                                 },
                                 {
                                     "id":  "documentary",
                                     "type":  "atom",
                                     "slot":  "style",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "纪录片质感",
                                     "en":  "documentary style",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  65,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [

                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "自然光、真实人群、无摆拍痕迹",
                                     "descEn":  "Natural light, real crowds, no posed feel",
                                     "example":  "documentary style, candid"
                                 },
                                 {
                                     "id":  "anime",
                                     "type":  "atom",
                                     "slot":  "style",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "日系动漫",
                                     "en":  "anime style",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  82,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [
                                                                           "photoreal"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "日式二维动画质感，线条干净色彩明快",
                                     "descEn":  "Japanese 2D animation look; clean lines, bright colors",
                                     "example":  "anime style, cel shaded"
                                 },
                                 {
                                     "id":  "cyberpunk-style",
                                     "type":  "macro",
                                     "slot":  "style",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "赛博朋克",
                                     "en":  "cyberpunk",
                                     "aliases":  {
                                                     "zh":  [
                                                                "赛博朋克风"
                                                            ],
                                                     "en":  [
                                                                "cyberpunk style"
                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  80,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [

                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [
                                                                         "cyberpunk-palette",
                                                                         "neon",
                                                                         "rainy-night"
                                                                     ]
                                                   },
                                     "desc":  "霓虹雨夜、义体与巨构建筑的世界观",
                                     "descEn":  "The world of neon rainy nights, implants and megastructures",
                                     "example":  "cyberpunk city"
                                 },
                                 {
                                     "id":  "ink-wash",
                                     "type":  "atom",
                                     "slot":  "style",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "水墨画",
                                     "en":  "ink wash painting",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  70,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [
                                                                           "photoreal"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "中国水墨的晕染与留白",
                                     "descEn":  "Chinese ink painting washes and negative space",
                                     "example":  "ink wash painting style"
                                 },
                                 {
                                     "id":  "claymation",
                                     "type":  "atom",
                                     "slot":  "style",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "黏土定格",
                                     "en":  "claymation",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  78,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [
                                                                           "photoreal"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "黏土质感与逐帧动画的拙趣",
                                     "descEn":  "Clay texture and the clumsy charm of stop-motion",
                                     "example":  "claymation style"
                                 },
                                 {
                                     "id":  "pixel-art",
                                     "type":  "atom",
                                     "slot":  "style",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "像素风",
                                     "en":  "pixel art",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  75,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [
                                                                           "photoreal"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "复古 8-bit 像素画面",
                                     "descEn":  "Retro 8-bit pixel look",
                                     "example":  "pixel art style"
                                 }
                             ],
                   "color":  [
                                 {
                                     "id":  "teal-orange",
                                     "type":  "atom",
                                     "slot":  "color",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "青橙色调",
                                     "en":  "teal and orange",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  88,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [
                                                                            "monochrome"
                                                                        ],
                                                       "softTension":  [
                                                                           "cyberpunk-palette",
                                                                           "pastel"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "暗部青、亮部橙的好莱坞大片标配，肤色友好",
                                     "descEn":  "Teal shadows + orange highlights, the Hollywood blockbuster standard; skin-friendly",
                                     "example":  "teal and orange color grade"
                                 },
                                 {
                                     "id":  "film-grain",
                                     "type":  "atom",
                                     "slot":  "color",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "胶片颗粒",
                                     "en":  "film grain",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  75,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [

                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "细腻噪点颗粒，复古胶片质感",
                                     "descEn":  "Fine noise grain; retro analog texture",
                                     "example":  "film grain, analog feel"
                                 },
                                 {
                                     "id":  "high-sat",
                                     "type":  "atom",
                                     "slot":  "color",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "高饱和",
                                     "en":  "vivid colors",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  85,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [
                                                                            "monochrome"
                                                                        ],
                                                       "softTension":  [
                                                                           "desaturated"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "鲜艳明快的色彩，适合广告与旅行",
                                     "descEn":  "Vivid bright colors; good for ads and travel",
                                     "example":  "vivid, highly saturated colors"
                                 },
                                 {
                                     "id":  "desaturated",
                                     "type":  "atom",
                                     "slot":  "color",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "低饱和褪色",
                                     "en":  "desaturated muted tones",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  72,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [

                                                                        ],
                                                       "softTension":  [
                                                                           "high-sat"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "低饱和灰调，克制、文艺、性冷淡",
                                     "descEn":  "Muted gray tones; restrained, arty, minimal",
                                     "example":  "desaturated, muted color palette"
                                 },
                                 {
                                     "id":  "cyberpunk-palette",
                                     "type":  "atom",
                                     "slot":  "color",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "赛博朋克配色",
                                     "en":  "cyberpunk neon palette",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  80,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [
                                                                            "monochrome"
                                                                        ],
                                                       "softTension":  [
                                                                           "teal-orange"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "品红+青蓝的霓虹夜色配色",
                                     "descEn":  "Magenta + cyan neon night palette",
                                     "example":  "cyberpunk neon palette, magenta and cyan"
                                 },
                                 {
                                     "id":  "monochrome",
                                     "type":  "atom",
                                     "slot":  "color",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "黑白",
                                     "en":  "monochrome",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  88,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [
                                                                            "teal-orange",
                                                                            "cyberpunk-palette",
                                                                            "high-sat",
                                                                            "pastel"
                                                                        ],
                                                       "softTension":  [

                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "纯黑白影调，剥离色彩聚焦光影结构",
                                     "descEn":  "Pure black-and-white; strips color to focus on light structure",
                                     "example":  "black and white, monochrome"
                                 },
                                 {
                                     "id":  "pastel",
                                     "type":  "atom",
                                     "slot":  "color",
                                     "modalities":  [
                                                        "image",
                                                        "video"
                                                    ],
                                     "zh":  "马卡龙粉彩",
                                     "en":  "pastel colors",
                                     "aliases":  {
                                                     "zh":  [

                                                            ],
                                                     "en":  [

                                                            ]
                                                 },
                                     "score":  {
                                                   "value":  78,
                                                   "status":  "heuristic",
                                                   "confidence":  null,
                                                   "benchmarkVersion":  null,
                                                   "sampleSize":  0,
                                                   "models":  [

                                                              ],
                                                   "updatedAt":  "2026-08"
                                               },
                                     "relations":  {
                                                       "hardConflict":  [
                                                                            "monochrome"
                                                                        ],
                                                       "softTension":  [
                                                                           "teal-orange"
                                                                       ],
                                                       "redundant":  [

                                                                     ],
                                                       "requires":  [

                                                                    ],
                                                       "implies":  [

                                                                   ],
                                                       "expandsTo":  [

                                                                     ]
                                                   },
                                     "desc":  "低饱和粉彩色系，甜美、治愈",
                                     "descEn":  "Low-saturation pastel colors; sweet and healing",
                                     "example":  "soft pastel colors"
                                 }
                             ],
                   "mood":  [
                                {
                                    "id":  "serene",
                                    "type":  "atom",
                                    "slot":  "mood",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "宁静",
                                    "en":  "serene",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  62,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [
                                                                          "suspense",
                                                                          "epic"
                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "平静安详的情绪底色",
                                    "descEn":  "Calm, peaceful emotional baseline",
                                    "example":  "serene, peaceful atmosphere"
                                },
                                {
                                    "id":  "epic",
                                    "type":  "atom",
                                    "slot":  "mood",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "史诗感",
                                    "en":  "epic scale",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  60,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "宏大壮阔；需要大远景+航拍配合",
                                    "descEn":  "Grand and magnificent; pair with extreme wide + aerial",
                                    "example":  "epic scale, grandiose"
                                },
                                {
                                    "id":  "melancholic",
                                    "type":  "atom",
                                    "slot":  "mood",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "孤独忧郁",
                                    "en":  "melancholic",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  58,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "克制而伤感的情绪；常配低饱和+雨",
                                    "descEn":  "Restrained sadness; often paired with desaturation + rain",
                                    "example":  "melancholic mood"
                                },
                                {
                                    "id":  "cozy",
                                    "type":  "atom",
                                    "slot":  "mood",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "温馨",
                                    "en":  "cozy warm",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  62,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [
                                                                          "suspense",
                                                                          "wasteland"
                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "暖调、柔软、治愈的居家感",
                                    "descEn":  "Warm, soft, healing indoor feel",
                                    "example":  "cozy and warm atmosphere"
                                },
                                {
                                    "id":  "suspense",
                                    "type":  "atom",
                                    "slot":  "mood",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "悬疑紧张",
                                    "en":  "suspenseful",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  55,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "不安与压迫感；常配手持+近景",
                                    "descEn":  "Unease and pressure; often paired with handheld + close shot",
                                    "example":  "suspenseful, tense atmosphere"
                                },
                                {
                                    "id":  "wasteland",
                                    "type":  "atom",
                                    "slot":  "mood",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "末日废土",
                                    "en":  "post-apocalyptic wasteland",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  75,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "废墟、荒漠与破败文明的荒凉",
                                    "descEn":  "Ruins, desert and the desolation of a fallen civilization",
                                    "example":  "post-apocalyptic wasteland"
                                }
                            ],
                   "composition":  [
                                       {
                                           "id":  "rule-of-thirds",
                                           "type":  "atom",
                                           "slot":  "composition",
                                           "modalities":  [
                                                              "image",
                                                              "video"
                                                          ],
                                           "zh":  "三分法",
                                           "en":  "rule of thirds",
                                           "aliases":  {
                                                           "zh":  [

                                                                  ],
                                                           "en":  [

                                                                  ]
                                                       },
                                           "score":  {
                                                         "value":  55,
                                                         "status":  "heuristic",
                                                         "confidence":  null,
                                                         "benchmarkVersion":  null,
                                                         "sampleSize":  0,
                                                         "models":  [

                                                                    ],
                                                         "updatedAt":  "2026-08"
                                                     },
                                           "relations":  {
                                                             "hardConflict":  [

                                                                              ],
                                                             "softTension":  [
                                                                                 "symmetry"
                                                                             ],
                                                             "redundant":  [

                                                                           ],
                                                             "requires":  [

                                                                          ],
                                                             "implies":  [

                                                                         ],
                                                             "expandsTo":  [

                                                                           ]
                                                         },
                                           "desc":  "主体落在三分线上；模型只是「大概遵守」，确定性低",
                                           "descEn":  "Subject on the third lines; models only roughly obey it — low determinism",
                                           "example":  "rule of thirds composition"
                                       },
                                       {
                                           "id":  "symmetry",
                                           "type":  "atom",
                                           "slot":  "composition",
                                           "modalities":  [
                                                              "image",
                                                              "video"
                                                          ],
                                           "zh":  "对称构图",
                                           "en":  "symmetrical composition",
                                           "aliases":  {
                                                           "zh":  [

                                                                  ],
                                                           "en":  [

                                                                  ]
                                                       },
                                           "score":  {
                                                         "value":  80,
                                                         "status":  "heuristic",
                                                         "confidence":  null,
                                                         "benchmarkVersion":  null,
                                                         "sampleSize":  0,
                                                         "models":  [

                                                                    ],
                                                         "updatedAt":  "2026-08"
                                                     },
                                           "relations":  {
                                                             "hardConflict":  [

                                                                              ],
                                                             "softTension":  [
                                                                                 "rule-of-thirds"
                                                                             ],
                                                             "redundant":  [

                                                                           ],
                                                             "requires":  [

                                                                          ],
                                                             "implies":  [

                                                                         ],
                                                             "expandsTo":  [

                                                                           ]
                                                         },
                                           "desc":  "左右严格对称，秩序感与仪式感",
                                           "descEn":  "Strict left-right symmetry; order and ritual",
                                           "example":  "perfectly symmetrical composition"
                                       },
                                       {
                                           "id":  "leading-lines",
                                           "type":  "atom",
                                           "slot":  "composition",
                                           "modalities":  [
                                                              "image",
                                                              "video"
                                                          ],
                                           "zh":  "引导线",
                                           "en":  "leading lines",
                                           "aliases":  {
                                                           "zh":  [

                                                                  ],
                                                           "en":  [

                                                                  ]
                                                       },
                                           "score":  {
                                                         "value":  62,
                                                         "status":  "heuristic",
                                                         "confidence":  null,
                                                         "benchmarkVersion":  null,
                                                         "sampleSize":  0,
                                                         "models":  [

                                                                    ],
                                                         "updatedAt":  "2026-08"
                                                     },
                                           "relations":  {
                                                             "hardConflict":  [

                                                                              ],
                                                             "softTension":  [

                                                                             ],
                                                             "redundant":  [

                                                                           ],
                                                             "requires":  [

                                                                          ],
                                                             "implies":  [

                                                                         ],
                                                             "expandsTo":  [

                                                                           ]
                                                         },
                                           "desc":  "道路/栏杆等线条把视线引向主体",
                                           "descEn":  "Roads, railings and other lines draw the eye to the subject",
                                           "example":  "leading lines pointing to the subject"
                                       },
                                       {
                                           "id":  "frame-in-frame",
                                           "type":  "atom",
                                           "slot":  "composition",
                                           "modalities":  [
                                                              "image",
                                                              "video"
                                                          ],
                                           "zh":  "框架式构图",
                                           "en":  "frame within a frame",
                                           "aliases":  {
                                                           "zh":  [

                                                                  ],
                                                           "en":  [

                                                                  ]
                                                       },
                                           "score":  {
                                                         "value":  65,
                                                         "status":  "heuristic",
                                                         "confidence":  null,
                                                         "benchmarkVersion":  null,
                                                         "sampleSize":  0,
                                                         "models":  [

                                                                    ],
                                                         "updatedAt":  "2026-08"
                                                     },
                                           "relations":  {
                                                             "hardConflict":  [

                                                                              ],
                                                             "softTension":  [

                                                                             ],
                                                             "redundant":  [

                                                                           ],
                                                             "requires":  [

                                                                          ],
                                                             "implies":  [

                                                                         ],
                                                             "expandsTo":  [

                                                                           ]
                                                         },
                                           "desc":  "门窗、拱廊形成天然画框包裹主体",
                                           "descEn":  "Doors, windows, arcades form a natural frame around the subject",
                                           "example":  "frame within a frame composition"
                                       },
                                       {
                                           "id":  "negative-space",
                                           "type":  "atom",
                                           "slot":  "composition",
                                           "modalities":  [
                                                              "image",
                                                              "video"
                                                          ],
                                           "zh":  "大面积留白",
                                           "en":  "negative space",
                                           "aliases":  {
                                                           "zh":  [

                                                                  ],
                                                           "en":  [

                                                                  ]
                                                       },
                                           "score":  {
                                                         "value":  68,
                                                         "status":  "heuristic",
                                                         "confidence":  null,
                                                         "benchmarkVersion":  null,
                                                         "sampleSize":  0,
                                                         "models":  [

                                                                    ],
                                                         "updatedAt":  "2026-08"
                                                     },
                                           "relations":  {
                                                             "hardConflict":  [

                                                                              ],
                                                             "softTension":  [

                                                                             ],
                                                             "redundant":  [

                                                                           ],
                                                             "requires":  [

                                                                          ],
                                                             "implies":  [

                                                                         ],
                                                             "expandsTo":  [

                                                                           ]
                                                         },
                                           "desc":  "大面积干净背景，极简与呼吸感",
                                           "descEn":  "Large clean background; minimal and breathable",
                                           "example":  "lots of negative space"
                                       }
                                   ],
                   "time":  [
                                {
                                    "id":  "dawn",
                                    "type":  "atom",
                                    "slot":  "time",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "黎明",
                                    "en":  "dawn",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  85,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [
                                                                          "night"
                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "日出前的冷蓝微光",
                                    "descEn":  "Cold blue glimmer before sunrise",
                                    "example":  "at dawn, first light"
                                },
                                {
                                    "id":  "blue-hour",
                                    "type":  "atom",
                                    "slot":  "time",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "蓝调时刻",
                                    "en":  "blue hour",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  88,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "日落后/日出前的深蓝天空，与暖色灯光绝配",
                                    "descEn":  "Deep blue sky after sunset / before sunrise; perfect with warm artificial lights",
                                    "example":  "blue hour, deep blue sky"
                                },
                                {
                                    "id":  "dusk",
                                    "type":  "atom",
                                    "slot":  "time",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "黄昏",
                                    "en":  "dusk",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  85,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [
                                                                          "night"
                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "日落时分的天际余晖",
                                    "descEn":  "The afterglow on the horizon at sunset",
                                    "example":  "at dusk"
                                },
                                {
                                    "id":  "night",
                                    "type":  "atom",
                                    "slot":  "time",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "夜晚",
                                    "en":  "night",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  82,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "暗夜环境；务必配合光源词避免死黑",
                                    "descEn":  "Dark night; always pair with a light source to avoid pure black",
                                    "example":  "at night"
                                },
                                {
                                    "id":  "rainy-night",
                                    "type":  "macro",
                                    "slot":  "time",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "雨夜",
                                    "en":  "rainy night",
                                    "aliases":  {
                                                    "zh":  [
                                                               "雨夜街景"
                                                           ],
                                                    "en":  [
                                                               "rainy night street"
                                                           ]
                                                },
                                    "score":  {
                                                  "value":  78,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [
                                                                      "night"
                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "雨+夜+湿润反光地面，赛博朋克标配",
                                    "descEn":  "Rain + night + wet reflective ground; the cyberpunk standard",
                                    "example":  "rainy night, wet reflections"
                                }
                            ],
                   "camera":  [
                                  {
                                      "id":  "dolly-in",
                                      "type":  "atom",
                                      "slot":  "camera",
                                      "modalities":  [
                                                         "video"
                                                     ],
                                      "zh":  "推镜头",
                                      "en":  "dolly in",
                                      "aliases":  {
                                                      "zh":  [

                                                             ],
                                                      "en":  [

                                                             ]
                                                  },
                                      "score":  {
                                                    "value":  85,
                                                    "status":  "heuristic",
                                                    "confidence":  null,
                                                    "benchmarkVersion":  null,
                                                    "sampleSize":  0,
                                                    "models":  [

                                                               ],
                                                    "updatedAt":  "2026-08"
                                                },
                                      "relations":  {
                                                        "hardConflict":  [

                                                                         ],
                                                        "softTension":  [

                                                                        ],
                                                        "redundant":  [

                                                                      ],
                                                        "requires":  [

                                                                     ],
                                                        "implies":  [

                                                                    ],
                                                        "expandsTo":  [

                                                                      ]
                                                    },
                                      "desc":  "镜头向主体推进，注意力逐渐聚焦",
                                      "descEn":  "Camera pushes toward the subject; attention focuses gradually",
                                      "example":  "slow dolly in toward the subject"
                                  },
                                  {
                                      "id":  "dolly-out",
                                      "type":  "atom",
                                      "slot":  "camera",
                                      "modalities":  [
                                                         "video"
                                                     ],
                                      "zh":  "拉镜头",
                                      "en":  "dolly out",
                                      "aliases":  {
                                                      "zh":  [

                                                             ],
                                                      "en":  [

                                                             ]
                                                  },
                                      "score":  {
                                                    "value":  80,
                                                    "status":  "heuristic",
                                                    "confidence":  null,
                                                    "benchmarkVersion":  null,
                                                    "sampleSize":  0,
                                                    "models":  [

                                                               ],
                                                    "updatedAt":  "2026-08"
                                                },
                                      "relations":  {
                                                        "hardConflict":  [

                                                                         ],
                                                        "softTension":  [

                                                                        ],
                                                        "redundant":  [

                                                                      ],
                                                        "requires":  [

                                                                     ],
                                                        "implies":  [

                                                                    ],
                                                        "expandsTo":  [

                                                                      ]
                                                    },
                                      "desc":  "镜头远离主体，揭示环境与孤独感",
                                      "descEn":  "Camera pulls away from the subject; reveals the environment and solitude",
                                      "example":  "dolly out revealing the vast space"
                                  },
                                  {
                                      "id":  "orbit",
                                      "type":  "atom",
                                      "slot":  "camera",
                                      "modalities":  [
                                                         "video"
                                                     ],
                                      "zh":  "环绕运镜",
                                      "en":  "orbit shot",
                                      "aliases":  {
                                                      "zh":  [

                                                             ],
                                                      "en":  [

                                                             ]
                                                  },
                                      "score":  {
                                                    "value":  88,
                                                    "status":  "heuristic",
                                                    "confidence":  null,
                                                    "benchmarkVersion":  null,
                                                    "sampleSize":  0,
                                                    "models":  [

                                                               ],
                                                    "updatedAt":  "2026-08"
                                                },
                                      "relations":  {
                                                        "hardConflict":  [

                                                                         ],
                                                        "softTension":  [

                                                                        ],
                                                        "redundant":  [

                                                                      ],
                                                        "requires":  [

                                                                     ],
                                                        "implies":  [

                                                                    ],
                                                        "expandsTo":  [

                                                                      ]
                                                    },
                                      "desc":  "围绕主体环形运动，展示全貌与气势",
                                      "descEn":  "Camera circles around the subject; shows the full picture and momentum",
                                      "example":  "camera orbiting around the subject"
                                  },
                                  {
                                      "id":  "dolly-zoom",
                                      "type":  "atom",
                                      "slot":  "camera",
                                      "modalities":  [
                                                         "video"
                                                     ],
                                      "zh":  "希区柯克变焦",
                                      "en":  "dolly zoom",
                                      "aliases":  {
                                                      "zh":  [

                                                             ],
                                                      "en":  [

                                                             ]
                                                  },
                                      "score":  {
                                                    "value":  60,
                                                    "status":  "heuristic",
                                                    "confidence":  null,
                                                    "benchmarkVersion":  null,
                                                    "sampleSize":  0,
                                                    "models":  [

                                                               ],
                                                    "updatedAt":  "2026-08"
                                                },
                                      "relations":  {
                                                        "hardConflict":  [

                                                                         ],
                                                        "softTension":  [

                                                                        ],
                                                        "redundant":  [

                                                                      ],
                                                        "requires":  [

                                                                     ],
                                                        "implies":  [

                                                                    ],
                                                        "expandsTo":  [

                                                                      ]
                                                    },
                                      "desc":  "推轨+反向变焦，背景剧烈变形，眩晕感；模型容易做崩",
                                      "descEn":  "Track in + zoom out; the background warps dramatically (vertigo effect); models often break it",
                                      "example":  "dolly zoom, vertigo effect, background stretching"
                                  },
                                  {
                                      "id":  "tracking",
                                      "type":  "atom",
                                      "slot":  "camera",
                                      "modalities":  [
                                                         "video"
                                                     ],
                                      "zh":  "跟拍镜头",
                                      "en":  "tracking shot",
                                      "aliases":  {
                                                      "zh":  [

                                                             ],
                                                      "en":  [

                                                             ]
                                                  },
                                      "score":  {
                                                    "value":  82,
                                                    "status":  "heuristic",
                                                    "confidence":  null,
                                                    "benchmarkVersion":  null,
                                                    "sampleSize":  0,
                                                    "models":  [

                                                               ],
                                                    "updatedAt":  "2026-08"
                                                },
                                      "relations":  {
                                                        "hardConflict":  [

                                                                         ],
                                                        "softTension":  [

                                                                        ],
                                                        "redundant":  [

                                                                      ],
                                                        "requires":  [

                                                                     ],
                                                        "implies":  [

                                                                    ],
                                                        "expandsTo":  [

                                                                      ]
                                                    },
                                      "desc":  "镜头与运动主体保持同步，代入感强",
                                      "descEn":  "Camera keeps pace with a moving subject; strong sense of immersion",
                                      "example":  "tracking shot following the runner"
                                  },
                                  {
                                      "id":  "handheld",
                                      "type":  "atom",
                                      "slot":  "camera",
                                      "modalities":  [
                                                         "video"
                                                     ],
                                      "zh":  "手持晃动",
                                      "en":  "handheld camera",
                                      "aliases":  {
                                                      "zh":  [

                                                             ],
                                                      "en":  [

                                                             ]
                                                  },
                                      "score":  {
                                                    "value":  65,
                                                    "status":  "heuristic",
                                                    "confidence":  null,
                                                    "benchmarkVersion":  null,
                                                    "sampleSize":  0,
                                                    "models":  [

                                                               ],
                                                    "updatedAt":  "2026-08"
                                                },
                                      "relations":  {
                                                        "hardConflict":  [
                                                                             "aerial",
                                                                             "crane"
                                                                         ],
                                                        "softTension":  [
                                                                            "long-take"
                                                                        ],
                                                        "redundant":  [

                                                                      ],
                                                        "requires":  [

                                                                     ],
                                                        "implies":  [

                                                                    ],
                                                        "expandsTo":  [

                                                                      ]
                                                    },
                                      "desc":  "轻微不规则晃动，纪实感/紧张感",
                                      "descEn":  "Slight irregular shake; documentary / tense feel",
                                      "example":  "handheld camera, slight shake"
                                  },
                                  {
                                      "id":  "aerial",
                                      "type":  "atom",
                                      "slot":  "camera",
                                      "modalities":  [
                                                         "video"
                                                     ],
                                      "zh":  "航拍",
                                      "en":  "aerial drone shot",
                                      "aliases":  {
                                                      "zh":  [

                                                             ],
                                                      "en":  [

                                                             ]
                                                  },
                                      "score":  {
                                                    "value":  90,
                                                    "status":  "heuristic",
                                                    "confidence":  null,
                                                    "benchmarkVersion":  null,
                                                    "sampleSize":  0,
                                                    "models":  [

                                                               ],
                                                    "updatedAt":  "2026-08"
                                                },
                                      "relations":  {
                                                        "hardConflict":  [
                                                                             "handheld"
                                                                         ],
                                                        "softTension":  [
                                                                            "long-take",
                                                                            "over-shoulder",
                                                                            "close-up"
                                                                        ],
                                                        "redundant":  [

                                                                      ],
                                                        "requires":  [

                                                                     ],
                                                        "implies":  [

                                                                    ],
                                                        "expandsTo":  [

                                                                      ]
                                                    },
                                      "desc":  "无人机高空俯拍，宏大叙事标配",
                                      "descEn":  "High-altitude drone view; the standard for epic storytelling",
                                      "example":  "aerial drone shot, bird\u0027s eye view"
                                  },
                                  {
                                      "id":  "crane",
                                      "type":  "atom",
                                      "slot":  "camera",
                                      "modalities":  [
                                                         "video"
                                                     ],
                                      "zh":  "升降镜头",
                                      "en":  "crane shot",
                                      "aliases":  {
                                                      "zh":  [

                                                             ],
                                                      "en":  [

                                                             ]
                                                  },
                                      "score":  {
                                                    "value":  75,
                                                    "status":  "heuristic",
                                                    "confidence":  null,
                                                    "benchmarkVersion":  null,
                                                    "sampleSize":  0,
                                                    "models":  [

                                                               ],
                                                    "updatedAt":  "2026-08"
                                                },
                                      "relations":  {
                                                        "hardConflict":  [
                                                                             "handheld"
                                                                         ],
                                                        "softTension":  [

                                                                        ],
                                                        "redundant":  [

                                                                      ],
                                                        "requires":  [

                                                                     ],
                                                        "implies":  [

                                                                    ],
                                                        "expandsTo":  [

                                                                      ]
                                                    },
                                      "desc":  "镜头垂直升降，常用于开场或情绪转换",
                                      "descEn":  "Camera rises or descends vertically; often used for openings or emotional turns",
                                      "example":  "crane shot rising above the crowd"
                                  }
                              ],
                   "shot":  [
                                {
                                    "id":  "close-up",
                                    "type":  "atom",
                                    "slot":  "shot",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "特写",
                                    "en":  "close-up",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [
                                                               "close up",
                                                               "closeup"
                                                           ]
                                                },
                                    "score":  {
                                                  "value":  90,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [
                                                                          "aerial"
                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "聚焦面部/局部，情绪与细节最大化",
                                    "descEn":  "Focused on the face / a part; maximizes emotion and detail",
                                    "example":  "close-up of the face"
                                },
                                {
                                    "id":  "extreme-close-up",
                                    "type":  "atom",
                                    "slot":  "shot",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "大特写",
                                    "en":  "extreme close-up",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  85,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "局部放大（眼睛、水滴），强调质感",
                                    "descEn":  "Extreme enlargement of a detail (eye, water drop); emphasizes texture",
                                    "example":  "extreme close-up of the eye"
                                },
                                {
                                    "id":  "medium",
                                    "type":  "atom",
                                    "slot":  "shot",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "中景",
                                    "en":  "medium shot",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  82,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "腰部以上，兼顾动作与表情的叙事景别",
                                    "descEn":  "Waist up; the narrative size that balances action and expression",
                                    "example":  "medium shot, waist up"
                                },
                                {
                                    "id":  "wide",
                                    "type":  "atom",
                                    "slot":  "shot",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "全景",
                                    "en":  "wide shot",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  85,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "完整呈现主体与所处环境",
                                    "descEn":  "Shows the subject and its environment completely",
                                    "example":  "wide shot of the whole scene"
                                },
                                {
                                    "id":  "extreme-wide",
                                    "type":  "atom",
                                    "slot":  "shot",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "大远景",
                                    "en":  "extreme wide shot",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  78,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [

                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "人在宏大环境中渺小如点，史诗/孤独感",
                                    "descEn":  "Human figures tiny in a vast landscape; epic or lonely",
                                    "example":  "extreme wide shot, tiny figure in landscape"
                                },
                                {
                                    "id":  "over-shoulder",
                                    "type":  "atom",
                                    "slot":  "shot",
                                    "modalities":  [
                                                       "image",
                                                       "video"
                                                   ],
                                    "zh":  "过肩镜头",
                                    "en":  "over-the-shoulder shot",
                                    "aliases":  {
                                                    "zh":  [

                                                           ],
                                                    "en":  [

                                                           ]
                                                },
                                    "score":  {
                                                  "value":  68,
                                                  "status":  "heuristic",
                                                  "confidence":  null,
                                                  "benchmarkVersion":  null,
                                                  "sampleSize":  0,
                                                  "models":  [

                                                             ],
                                                  "updatedAt":  "2026-08"
                                              },
                                    "relations":  {
                                                      "hardConflict":  [

                                                                       ],
                                                      "softTension":  [
                                                                          "aerial"
                                                                      ],
                                                      "redundant":  [

                                                                    ],
                                                      "requires":  [

                                                                   ],
                                                      "implies":  [

                                                                  ],
                                                      "expandsTo":  [

                                                                    ]
                                                  },
                                    "desc":  "越过前景人物肩膀拍摄，对话戏标配",
                                    "descEn":  "Shot from behind a foreground person\u0027s shoulder; the dialogue standard",
                                    "example":  "over-the-shoulder shot"
                                }
                            ],
                   "technique":  [
                                     {
                                         "id":  "shallow-dof",
                                         "type":  "atom",
                                         "slot":  "technique",
                                         "modalities":  [
                                                            "image",
                                                            "video"
                                                        ],
                                         "zh":  "浅景深",
                                         "en":  "shallow depth of field",
                                         "aliases":  {
                                                         "zh":  [

                                                                ],
                                                         "en":  [
                                                                    "shallow dof",
                                                                    "depth of field"
                                                                ]
                                                     },
                                         "score":  {
                                                       "value":  82,
                                                       "status":  "heuristic",
                                                       "confidence":  null,
                                                       "benchmarkVersion":  null,
                                                       "sampleSize":  0,
                                                       "models":  [

                                                                  ],
                                                       "updatedAt":  "2026-08"
                                                   },
                                         "relations":  {
                                                           "hardConflict":  [

                                                                            ],
                                                           "softTension":  [

                                                                           ],
                                                           "redundant":  [

                                                                         ],
                                                           "requires":  [

                                                                        ],
                                                           "implies":  [

                                                                       ],
                                                           "expandsTo":  [

                                                                         ]
                                                       },
                                         "desc":  "背景奶油般虚化，主体锐利突出",
                                         "descEn":  "Creamy blurred background, sharp prominent subject",
                                         "example":  "shallow depth of field, creamy bokeh"
                                     },
                                     {
                                         "id":  "telephoto",
                                         "type":  "atom",
                                         "slot":  "technique",
                                         "modalities":  [
                                                            "image",
                                                            "video"
                                                        ],
                                         "zh":  "长焦压缩",
                                         "en":  "telephoto compression",
                                         "aliases":  {
                                                         "zh":  [

                                                                ],
                                                         "en":  [

                                                                ]
                                                     },
                                         "score":  {
                                                       "value":  70,
                                                       "status":  "heuristic",
                                                       "confidence":  null,
                                                       "benchmarkVersion":  null,
                                                       "sampleSize":  0,
                                                       "models":  [

                                                                  ],
                                                       "updatedAt":  "2026-08"
                                                   },
                                         "relations":  {
                                                           "hardConflict":  [

                                                                            ],
                                                           "softTension":  [

                                                                           ],
                                                           "redundant":  [

                                                                         ],
                                                           "requires":  [

                                                                        ],
                                                           "implies":  [

                                                                       ],
                                                           "expandsTo":  [

                                                                         ]
                                                       },
                                         "desc":  "长焦把远近景物压缩在同一平面",
                                         "descEn":  "A long lens compresses near and far into one plane",
                                         "example":  "telephoto lens compression"
                                     },
                                     {
                                         "id":  "macro",
                                         "type":  "atom",
                                         "slot":  "technique",
                                         "modalities":  [
                                                            "image",
                                                            "video"
                                                        ],
                                         "zh":  "微距",
                                         "en":  "macro",
                                         "aliases":  {
                                                         "zh":  [

                                                                ],
                                                         "en":  [

                                                                ]
                                                     },
                                         "score":  {
                                                       "value":  85,
                                                       "status":  "heuristic",
                                                       "confidence":  null,
                                                       "benchmarkVersion":  null,
                                                       "sampleSize":  0,
                                                       "models":  [

                                                                  ],
                                                       "updatedAt":  "2026-08"
                                                   },
                                         "relations":  {
                                                           "hardConflict":  [

                                                                            ],
                                                           "softTension":  [

                                                                           ],
                                                           "redundant":  [

                                                                         ],
                                                           "requires":  [

                                                                        ],
                                                           "implies":  [

                                                                       ],
                                                           "expandsTo":  [

                                                                         ]
                                                       },
                                         "desc":  "极近距离拍摄的放大细节",
                                         "descEn":  "Greatly enlarged detail shot from very close",
                                         "example":  "macro shot"
                                     },
                                     {
                                         "id":  "time-lapse",
                                         "type":  "atom",
                                         "slot":  "technique",
                                         "modalities":  [
                                                            "video"
                                                        ],
                                         "zh":  "延时摄影",
                                         "en":  "time-lapse",
                                         "aliases":  {
                                                         "zh":  [

                                                                ],
                                                         "en":  [
                                                                    "time lapse",
                                                                    "timelapse"
                                                                ]
                                                     },
                                         "score":  {
                                                       "value":  88,
                                                       "status":  "heuristic",
                                                       "confidence":  null,
                                                       "benchmarkVersion":  null,
                                                       "sampleSize":  0,
                                                       "models":  [

                                                                  ],
                                                       "updatedAt":  "2026-08"
                                                   },
                                         "relations":  {
                                                           "hardConflict":  [
                                                                                "slow-motion"
                                                                            ],
                                                           "softTension":  [

                                                                           ],
                                                           "redundant":  [

                                                                         ],
                                                           "requires":  [

                                                                        ],
                                                           "implies":  [

                                                                       ],
                                                           "expandsTo":  [

                                                                         ]
                                                       },
                                         "desc":  "长时间压缩，云流、星轨、人流",
                                         "descEn":  "Long time compressed: cloud flows, star trails, crowds",
                                         "example":  "time-lapse"
                                     },
                                     {
                                         "id":  "slow-motion",
                                         "type":  "atom",
                                         "slot":  "technique",
                                         "modalities":  [
                                                            "video"
                                                        ],
                                         "zh":  "慢动作",
                                         "en":  "slow motion",
                                         "aliases":  {
                                                         "zh":  [

                                                                ],
                                                         "en":  [
                                                                    "slow motion"
                                                                ]
                                                     },
                                         "score":  {
                                                       "value":  85,
                                                       "status":  "heuristic",
                                                       "confidence":  null,
                                                       "benchmarkVersion":  null,
                                                       "sampleSize":  0,
                                                       "models":  [

                                                                  ],
                                                       "updatedAt":  "2026-08"
                                                   },
                                         "relations":  {
                                                           "hardConflict":  [
                                                                                "time-lapse"
                                                                            ],
                                                           "softTension":  [

                                                                           ],
                                                           "redundant":  [

                                                                         ],
                                                           "requires":  [

                                                                        ],
                                                           "implies":  [

                                                                       ],
                                                           "expandsTo":  [

                                                                         ]
                                                       },
                                         "desc":  "高速拍摄慢速回放，放大瞬间",
                                         "descEn":  "High-speed capture played back slowly; amplifies the moment",
                                         "example":  "slow motion"
                                     },
                                     {
                                         "id":  "long-take",
                                         "type":  "atom",
                                         "slot":  "technique",
                                         "modalities":  [
                                                            "video"
                                                        ],
                                         "zh":  "一镜到底",
                                         "en":  "long take",
                                         "aliases":  {
                                                         "zh":  [

                                                                ],
                                                         "en":  [

                                                                ]
                                                     },
                                         "score":  {
                                                       "value":  55,
                                                       "status":  "heuristic",
                                                       "confidence":  null,
                                                       "benchmarkVersion":  null,
                                                       "sampleSize":  0,
                                                       "models":  [

                                                                  ],
                                                       "updatedAt":  "2026-08"
                                                   },
                                         "relations":  {
                                                           "hardConflict":  [

                                                                            ],
                                                           "softTension":  [
                                                                               "aerial",
                                                                               "handheld"
                                                                           ],
                                                           "redundant":  [

                                                                         ],
                                                           "requires":  [

                                                                        ],
                                                           "implies":  [

                                                                       ],
                                                           "expandsTo":  [

                                                                         ]
                                                       },
                                         "desc":  "单镜头不剪辑；模型常在中途崩溃，慎用",
                                         "descEn":  "One continuous shot without cuts; models often break midway — use with caution",
                                         "example":  "one continuous long take"
                                     },
                                     {
                                         "id":  "fisheye",
                                         "type":  "atom",
                                         "slot":  "technique",
                                         "modalities":  [
                                                            "image",
                                                            "video"
                                                        ],
                                         "zh":  "鱼眼镜头",
                                         "en":  "fisheye lens",
                                         "aliases":  {
                                                         "zh":  [

                                                                ],
                                                         "en":  [

                                                                ]
                                                     },
                                         "score":  {
                                                       "value":  80,
                                                       "status":  "heuristic",
                                                       "confidence":  null,
                                                       "benchmarkVersion":  null,
                                                       "sampleSize":  0,
                                                       "models":  [

                                                                  ],
                                                       "updatedAt":  "2026-08"
                                                   },
                                         "relations":  {
                                                           "hardConflict":  [

                                                                            ],
                                                           "softTension":  [

                                                                           ],
                                                           "redundant":  [

                                                                         ],
                                                           "requires":  [

                                                                        ],
                                                           "implies":  [

                                                                       ],
                                                           "expandsTo":  [

                                                                         ]
                                                       },
                                         "desc":  "夸张桶形畸变，滑板/派对/迷幻感",
                                         "descEn":  "Exaggerated barrel distortion; skate / party / psychedelic",
                                         "example":  "fisheye lens distortion"
                                     },
                                     {
                                         "id":  "vhs",
                                         "type":  "atom",
                                         "slot":  "technique",
                                         "modalities":  [
                                                            "image",
                                                            "video"
                                                        ],
                                         "zh":  "复古录像带",
                                         "en":  "VHS aesthetic",
                                         "aliases":  {
                                                         "zh":  [

                                                                ],
                                                         "en":  [

                                                                ]
                                                     },
                                         "score":  {
                                                       "value":  78,
                                                       "status":  "heuristic",
                                                       "confidence":  null,
                                                       "benchmarkVersion":  null,
                                                       "sampleSize":  0,
                                                       "models":  [

                                                                  ],
                                                       "updatedAt":  "2026-08"
                                                   },
                                         "relations":  {
                                                           "hardConflict":  [

                                                                            ],
                                                           "softTension":  [

                                                                           ],
                                                           "redundant":  [

                                                                         ],
                                                           "requires":  [

                                                                        ],
                                                           "implies":  [

                                                                       ],
                                                           "expandsTo":  [

                                                                         ]
                                                       },
                                         "desc":  "老式录像带质感：扫描线、噪点、偏色",
                                         "descEn":  "Old VHS look: scanlines, noise, color drift",
                                         "example":  "VHS aesthetic, tracking lines"
                                     }
                                 ]
               },
    "totalAtoms":  60,
    "atoms":  [
                  {
                      "id":  "golden-hour",
                      "type":  "atom",
                      "slot":  "lighting",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "黄金时刻",
                      "en":  "golden hour",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  92,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "日出后/日落前一小时的低角度暖光，人物轮廓自带金边",
                      "descEn":  "Low-angle warm light of the hour after sunrise / before sunset; faces get a natural golden rim",
                      "example":  "golden hour light, warm rim on face"
                  },
                  {
                      "id":  "overcast",
                      "type":  "atom",
                      "slot":  "lighting",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "阴天柔光",
                      "en":  "overcast soft light",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  88,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "云层散射的均匀柔光，无硬阴影，肤色干净",
                      "descEn":  "Even soft light diffused by clouds, no harsh shadows, clean skin tones",
                      "example":  "overcast soft light, no harsh shadows"
                  },
                  {
                      "id":  "neon",
                      "type":  "atom",
                      "slot":  "lighting",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "霓虹光",
                      "en":  "neon glow",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "霓虹灯管的多彩光晕，城市夜景标配",
                      "descEn":  "Colorful glow of neon tubes, a night-city staple",
                      "example":  "neon glow, pink and cyan lights"
                  },
                  {
                      "id":  "volumetric",
                      "type":  "atom",
                      "slot":  "lighting",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "体积光",
                      "en":  "volumetric light",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  72,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "可见光束（丁达尔效应），氛围感强但强度易失控",
                      "descEn":  "Visible light beams (Tyndall effect); atmospheric but the intensity can get out of control",
                      "example":  "volumetric light rays through window"
                  },
                  {
                      "id":  "rembrandt",
                      "type":  "atom",
                      "slot":  "lighting",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "伦勃朗光",
                      "en":  "Rembrandt lighting",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  80,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "侧上方主光在暗侧脸颊形成三角光斑，肖像经典",
                      "descEn":  "Key light from the upper side creates a triangle patch on the shadow cheek; a portrait classic",
                      "example":  "Rembrandt lighting, triangle patch on cheek"
                  },
                  {
                      "id":  "rim",
                      "type":  "atom",
                      "slot":  "lighting",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "轮廓光",
                      "en":  "rim light",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  84,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "逆侧光勾勒主体边缘，与背景分离",
                      "descEn":  "Back-side light outlines the subject\u0027s edge, separating it from the background",
                      "example":  "rim light outlining the silhouette"
                  },
                  {
                      "id":  "backlit",
                      "type":  "atom",
                      "slot":  "lighting",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "逆光剪影",
                      "en":  "backlit silhouette",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  78,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "主体处于逆光位呈剪影，细节交给轮廓",
                      "descEn":  "Subject against the light becomes a silhouette; details are left to the contour",
                      "example":  "backlit silhouette against sunset"
                  },
                  {
                      "id":  "dolly-in",
                      "type":  "atom",
                      "slot":  "camera",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "推镜头",
                      "en":  "dolly in",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "镜头向主体推进，注意力逐渐聚焦",
                      "descEn":  "Camera pushes toward the subject; attention focuses gradually",
                      "example":  "slow dolly in toward the subject"
                  },
                  {
                      "id":  "dolly-out",
                      "type":  "atom",
                      "slot":  "camera",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "拉镜头",
                      "en":  "dolly out",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  80,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "镜头远离主体，揭示环境与孤独感",
                      "descEn":  "Camera pulls away from the subject; reveals the environment and solitude",
                      "example":  "dolly out revealing the vast space"
                  },
                  {
                      "id":  "orbit",
                      "type":  "atom",
                      "slot":  "camera",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "环绕运镜",
                      "en":  "orbit shot",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  88,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "围绕主体环形运动，展示全貌与气势",
                      "descEn":  "Camera circles around the subject; shows the full picture and momentum",
                      "example":  "camera orbiting around the subject"
                  },
                  {
                      "id":  "dolly-zoom",
                      "type":  "atom",
                      "slot":  "camera",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "希区柯克变焦",
                      "en":  "dolly zoom",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  60,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "推轨+反向变焦，背景剧烈变形，眩晕感；模型容易做崩",
                      "descEn":  "Track in + zoom out; the background warps dramatically (vertigo effect); models often break it",
                      "example":  "dolly zoom, vertigo effect, background stretching"
                  },
                  {
                      "id":  "tracking",
                      "type":  "atom",
                      "slot":  "camera",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "跟拍镜头",
                      "en":  "tracking shot",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  82,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "镜头与运动主体保持同步，代入感强",
                      "descEn":  "Camera keeps pace with a moving subject; strong sense of immersion",
                      "example":  "tracking shot following the runner"
                  },
                  {
                      "id":  "handheld",
                      "type":  "atom",
                      "slot":  "camera",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "手持晃动",
                      "en":  "handheld camera",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  65,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "aerial",
                                                             "crane"
                                                         ],
                                        "softTension":  [
                                                            "long-take"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "轻微不规则晃动，纪实感/紧张感",
                      "descEn":  "Slight irregular shake; documentary / tense feel",
                      "example":  "handheld camera, slight shake"
                  },
                  {
                      "id":  "aerial",
                      "type":  "atom",
                      "slot":  "camera",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "航拍",
                      "en":  "aerial drone shot",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  90,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "handheld"
                                                         ],
                                        "softTension":  [
                                                            "long-take",
                                                            "over-shoulder",
                                                            "close-up"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "无人机高空俯拍，宏大叙事标配",
                      "descEn":  "High-altitude drone view; the standard for epic storytelling",
                      "example":  "aerial drone shot, bird\u0027s eye view"
                  },
                  {
                      "id":  "crane",
                      "type":  "atom",
                      "slot":  "camera",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "升降镜头",
                      "en":  "crane shot",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  75,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "handheld"
                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "镜头垂直升降，常用于开场或情绪转换",
                      "descEn":  "Camera rises or descends vertically; often used for openings or emotional turns",
                      "example":  "crane shot rising above the crowd"
                  },
                  {
                      "id":  "close-up",
                      "type":  "atom",
                      "slot":  "shot",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "特写",
                      "en":  "close-up",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [
                                                 "close up",
                                                 "closeup"
                                             ]
                                  },
                      "score":  {
                                    "value":  90,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "aerial"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "聚焦面部/局部，情绪与细节最大化",
                      "descEn":  "Focused on the face / a part; maximizes emotion and detail",
                      "example":  "close-up of the face"
                  },
                  {
                      "id":  "extreme-close-up",
                      "type":  "atom",
                      "slot":  "shot",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "大特写",
                      "en":  "extreme close-up",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "局部放大（眼睛、水滴），强调质感",
                      "descEn":  "Extreme enlargement of a detail (eye, water drop); emphasizes texture",
                      "example":  "extreme close-up of the eye"
                  },
                  {
                      "id":  "medium",
                      "type":  "atom",
                      "slot":  "shot",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "中景",
                      "en":  "medium shot",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  82,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "腰部以上，兼顾动作与表情的叙事景别",
                      "descEn":  "Waist up; the narrative size that balances action and expression",
                      "example":  "medium shot, waist up"
                  },
                  {
                      "id":  "wide",
                      "type":  "atom",
                      "slot":  "shot",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "全景",
                      "en":  "wide shot",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "完整呈现主体与所处环境",
                      "descEn":  "Shows the subject and its environment completely",
                      "example":  "wide shot of the whole scene"
                  },
                  {
                      "id":  "extreme-wide",
                      "type":  "atom",
                      "slot":  "shot",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "大远景",
                      "en":  "extreme wide shot",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  78,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "人在宏大环境中渺小如点，史诗/孤独感",
                      "descEn":  "Human figures tiny in a vast landscape; epic or lonely",
                      "example":  "extreme wide shot, tiny figure in landscape"
                  },
                  {
                      "id":  "over-shoulder",
                      "type":  "atom",
                      "slot":  "shot",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "过肩镜头",
                      "en":  "over-the-shoulder shot",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  68,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "aerial"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "越过前景人物肩膀拍摄，对话戏标配",
                      "descEn":  "Shot from behind a foreground person\u0027s shoulder; the dialogue standard",
                      "example":  "over-the-shoulder shot"
                  },
                  {
                      "id":  "rule-of-thirds",
                      "type":  "atom",
                      "slot":  "composition",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "三分法",
                      "en":  "rule of thirds",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  55,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "symmetry"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "主体落在三分线上；模型只是「大概遵守」，确定性低",
                      "descEn":  "Subject on the third lines; models only roughly obey it — low determinism",
                      "example":  "rule of thirds composition"
                  },
                  {
                      "id":  "symmetry",
                      "type":  "atom",
                      "slot":  "composition",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "对称构图",
                      "en":  "symmetrical composition",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  80,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "rule-of-thirds"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "左右严格对称，秩序感与仪式感",
                      "descEn":  "Strict left-right symmetry; order and ritual",
                      "example":  "perfectly symmetrical composition"
                  },
                  {
                      "id":  "leading-lines",
                      "type":  "atom",
                      "slot":  "composition",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "引导线",
                      "en":  "leading lines",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  62,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "道路/栏杆等线条把视线引向主体",
                      "descEn":  "Roads, railings and other lines draw the eye to the subject",
                      "example":  "leading lines pointing to the subject"
                  },
                  {
                      "id":  "frame-in-frame",
                      "type":  "atom",
                      "slot":  "composition",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "框架式构图",
                      "en":  "frame within a frame",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  65,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "门窗、拱廊形成天然画框包裹主体",
                      "descEn":  "Doors, windows, arcades form a natural frame around the subject",
                      "example":  "frame within a frame composition"
                  },
                  {
                      "id":  "negative-space",
                      "type":  "atom",
                      "slot":  "composition",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "大面积留白",
                      "en":  "negative space",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  68,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "大面积干净背景，极简与呼吸感",
                      "descEn":  "Large clean background; minimal and breathable",
                      "example":  "lots of negative space"
                  },
                  {
                      "id":  "teal-orange",
                      "type":  "atom",
                      "slot":  "color",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "青橙色调",
                      "en":  "teal and orange",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  88,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "monochrome"
                                                         ],
                                        "softTension":  [
                                                            "cyberpunk-palette",
                                                            "pastel"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "暗部青、亮部橙的好莱坞大片标配，肤色友好",
                      "descEn":  "Teal shadows + orange highlights, the Hollywood blockbuster standard; skin-friendly",
                      "example":  "teal and orange color grade"
                  },
                  {
                      "id":  "film-grain",
                      "type":  "atom",
                      "slot":  "color",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "胶片颗粒",
                      "en":  "film grain",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  75,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "细腻噪点颗粒，复古胶片质感",
                      "descEn":  "Fine noise grain; retro analog texture",
                      "example":  "film grain, analog feel"
                  },
                  {
                      "id":  "high-sat",
                      "type":  "atom",
                      "slot":  "color",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "高饱和",
                      "en":  "vivid colors",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "monochrome"
                                                         ],
                                        "softTension":  [
                                                            "desaturated"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "鲜艳明快的色彩，适合广告与旅行",
                      "descEn":  "Vivid bright colors; good for ads and travel",
                      "example":  "vivid, highly saturated colors"
                  },
                  {
                      "id":  "desaturated",
                      "type":  "atom",
                      "slot":  "color",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "低饱和褪色",
                      "en":  "desaturated muted tones",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  72,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "high-sat"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "低饱和灰调，克制、文艺、性冷淡",
                      "descEn":  "Muted gray tones; restrained, arty, minimal",
                      "example":  "desaturated, muted color palette"
                  },
                  {
                      "id":  "cyberpunk-palette",
                      "type":  "atom",
                      "slot":  "color",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "赛博朋克配色",
                      "en":  "cyberpunk neon palette",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  80,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "monochrome"
                                                         ],
                                        "softTension":  [
                                                            "teal-orange"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "品红+青蓝的霓虹夜色配色",
                      "descEn":  "Magenta + cyan neon night palette",
                      "example":  "cyberpunk neon palette, magenta and cyan"
                  },
                  {
                      "id":  "monochrome",
                      "type":  "atom",
                      "slot":  "color",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "黑白",
                      "en":  "monochrome",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  88,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "teal-orange",
                                                             "cyberpunk-palette",
                                                             "high-sat",
                                                             "pastel"
                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "纯黑白影调，剥离色彩聚焦光影结构",
                      "descEn":  "Pure black-and-white; strips color to focus on light structure",
                      "example":  "black and white, monochrome"
                  },
                  {
                      "id":  "pastel",
                      "type":  "atom",
                      "slot":  "color",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "马卡龙粉彩",
                      "en":  "pastel colors",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  78,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "monochrome"
                                                         ],
                                        "softTension":  [
                                                            "teal-orange"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "低饱和粉彩色系，甜美、治愈",
                      "descEn":  "Low-saturation pastel colors; sweet and healing",
                      "example":  "soft pastel colors"
                  },
                  {
                      "id":  "cinematic",
                      "type":  "macro",
                      "slot":  "style",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "电影感",
                      "en":  "cinematic",
                      "aliases":  {
                                      "zh":  [
                                                 "电影质感"
                                             ],
                                      "en":  [
                                                 "cinematic look"
                                             ]
                                  },
                      "score":  {
                                    "value":  55,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [
                                                          "shallow-dof",
                                                          "film-grain",
                                                          "teal-orange"
                                                      ]
                                    },
                      "desc":  "使用最滥也最模糊的词；建议拆成景深+调色+运镜",
                      "descEn":  "The most overused and vaguest word; better split into DOF + grade + camera move",
                      "example":  "cinematic look"
                  },
                  {
                      "id":  "photoreal",
                      "type":  "atom",
                      "slot":  "style",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "写实摄影",
                      "en":  "photorealistic",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  60,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "anime",
                                                            "ink-wash",
                                                            "claymation",
                                                            "pixel-art"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "逼近真实照片；模型基准线，确定性中等",
                      "descEn":  "Close to real photos; the model baseline, medium determinism",
                      "example":  "photorealistic, shot on 35mm"
                  },
                  {
                      "id":  "documentary",
                      "type":  "atom",
                      "slot":  "style",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "纪录片质感",
                      "en":  "documentary style",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  65,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "自然光、真实人群、无摆拍痕迹",
                      "descEn":  "Natural light, real crowds, no posed feel",
                      "example":  "documentary style, candid"
                  },
                  {
                      "id":  "anime",
                      "type":  "atom",
                      "slot":  "style",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "日系动漫",
                      "en":  "anime style",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  82,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "photoreal"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "日式二维动画质感，线条干净色彩明快",
                      "descEn":  "Japanese 2D animation look; clean lines, bright colors",
                      "example":  "anime style, cel shaded"
                  },
                  {
                      "id":  "cyberpunk-style",
                      "type":  "macro",
                      "slot":  "style",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "赛博朋克",
                      "en":  "cyberpunk",
                      "aliases":  {
                                      "zh":  [
                                                 "赛博朋克风"
                                             ],
                                      "en":  [
                                                 "cyberpunk style"
                                             ]
                                  },
                      "score":  {
                                    "value":  80,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [
                                                          "cyberpunk-palette",
                                                          "neon",
                                                          "rainy-night"
                                                      ]
                                    },
                      "desc":  "霓虹雨夜、义体与巨构建筑的世界观",
                      "descEn":  "The world of neon rainy nights, implants and megastructures",
                      "example":  "cyberpunk city"
                  },
                  {
                      "id":  "ink-wash",
                      "type":  "atom",
                      "slot":  "style",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "水墨画",
                      "en":  "ink wash painting",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  70,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "photoreal"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "中国水墨的晕染与留白",
                      "descEn":  "Chinese ink painting washes and negative space",
                      "example":  "ink wash painting style"
                  },
                  {
                      "id":  "claymation",
                      "type":  "atom",
                      "slot":  "style",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "黏土定格",
                      "en":  "claymation",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  78,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "photoreal"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "黏土质感与逐帧动画的拙趣",
                      "descEn":  "Clay texture and the clumsy charm of stop-motion",
                      "example":  "claymation style"
                  },
                  {
                      "id":  "pixel-art",
                      "type":  "atom",
                      "slot":  "style",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "像素风",
                      "en":  "pixel art",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  75,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "photoreal"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "复古 8-bit 像素画面",
                      "descEn":  "Retro 8-bit pixel look",
                      "example":  "pixel art style"
                  },
                  {
                      "id":  "serene",
                      "type":  "atom",
                      "slot":  "mood",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "宁静",
                      "en":  "serene",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  62,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "suspense",
                                                            "epic"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "平静安详的情绪底色",
                      "descEn":  "Calm, peaceful emotional baseline",
                      "example":  "serene, peaceful atmosphere"
                  },
                  {
                      "id":  "epic",
                      "type":  "atom",
                      "slot":  "mood",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "史诗感",
                      "en":  "epic scale",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  60,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "宏大壮阔；需要大远景+航拍配合",
                      "descEn":  "Grand and magnificent; pair with extreme wide + aerial",
                      "example":  "epic scale, grandiose"
                  },
                  {
                      "id":  "melancholic",
                      "type":  "atom",
                      "slot":  "mood",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "孤独忧郁",
                      "en":  "melancholic",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  58,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "克制而伤感的情绪；常配低饱和+雨",
                      "descEn":  "Restrained sadness; often paired with desaturation + rain",
                      "example":  "melancholic mood"
                  },
                  {
                      "id":  "cozy",
                      "type":  "atom",
                      "slot":  "mood",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "温馨",
                      "en":  "cozy warm",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  62,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "suspense",
                                                            "wasteland"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "暖调、柔软、治愈的居家感",
                      "descEn":  "Warm, soft, healing indoor feel",
                      "example":  "cozy and warm atmosphere"
                  },
                  {
                      "id":  "suspense",
                      "type":  "atom",
                      "slot":  "mood",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "悬疑紧张",
                      "en":  "suspenseful",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  55,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "不安与压迫感；常配手持+近景",
                      "descEn":  "Unease and pressure; often paired with handheld + close shot",
                      "example":  "suspenseful, tense atmosphere"
                  },
                  {
                      "id":  "wasteland",
                      "type":  "atom",
                      "slot":  "mood",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "末日废土",
                      "en":  "post-apocalyptic wasteland",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  75,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "废墟、荒漠与破败文明的荒凉",
                      "descEn":  "Ruins, desert and the desolation of a fallen civilization",
                      "example":  "post-apocalyptic wasteland"
                  },
                  {
                      "id":  "dawn",
                      "type":  "atom",
                      "slot":  "time",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "黎明",
                      "en":  "dawn",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "night"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "日出前的冷蓝微光",
                      "descEn":  "Cold blue glimmer before sunrise",
                      "example":  "at dawn, first light"
                  },
                  {
                      "id":  "blue-hour",
                      "type":  "atom",
                      "slot":  "time",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "蓝调时刻",
                      "en":  "blue hour",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  88,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "日落后/日出前的深蓝天空，与暖色灯光绝配",
                      "descEn":  "Deep blue sky after sunset / before sunrise; perfect with warm artificial lights",
                      "example":  "blue hour, deep blue sky"
                  },
                  {
                      "id":  "dusk",
                      "type":  "atom",
                      "slot":  "time",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "黄昏",
                      "en":  "dusk",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "night"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "日落时分的天际余晖",
                      "descEn":  "The afterglow on the horizon at sunset",
                      "example":  "at dusk"
                  },
                  {
                      "id":  "night",
                      "type":  "atom",
                      "slot":  "time",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "夜晚",
                      "en":  "night",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  82,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "暗夜环境；务必配合光源词避免死黑",
                      "descEn":  "Dark night; always pair with a light source to avoid pure black",
                      "example":  "at night"
                  },
                  {
                      "id":  "rainy-night",
                      "type":  "macro",
                      "slot":  "time",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "雨夜",
                      "en":  "rainy night",
                      "aliases":  {
                                      "zh":  [
                                                 "雨夜街景"
                                             ],
                                      "en":  [
                                                 "rainy night street"
                                             ]
                                  },
                      "score":  {
                                    "value":  78,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [
                                                        "night"
                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "雨+夜+湿润反光地面，赛博朋克标配",
                      "descEn":  "Rain + night + wet reflective ground; the cyberpunk standard",
                      "example":  "rainy night, wet reflections"
                  },
                  {
                      "id":  "shallow-dof",
                      "type":  "atom",
                      "slot":  "technique",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "浅景深",
                      "en":  "shallow depth of field",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [
                                                 "shallow dof",
                                                 "depth of field"
                                             ]
                                  },
                      "score":  {
                                    "value":  82,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "背景奶油般虚化，主体锐利突出",
                      "descEn":  "Creamy blurred background, sharp prominent subject",
                      "example":  "shallow depth of field, creamy bokeh"
                  },
                  {
                      "id":  "telephoto",
                      "type":  "atom",
                      "slot":  "technique",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "长焦压缩",
                      "en":  "telephoto compression",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  70,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "长焦把远近景物压缩在同一平面",
                      "descEn":  "A long lens compresses near and far into one plane",
                      "example":  "telephoto lens compression"
                  },
                  {
                      "id":  "macro",
                      "type":  "atom",
                      "slot":  "technique",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "微距",
                      "en":  "macro",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "极近距离拍摄的放大细节",
                      "descEn":  "Greatly enlarged detail shot from very close",
                      "example":  "macro shot"
                  },
                  {
                      "id":  "time-lapse",
                      "type":  "atom",
                      "slot":  "technique",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "延时摄影",
                      "en":  "time-lapse",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [
                                                 "time lapse",
                                                 "timelapse"
                                             ]
                                  },
                      "score":  {
                                    "value":  88,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "slow-motion"
                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "长时间压缩，云流、星轨、人流",
                      "descEn":  "Long time compressed: cloud flows, star trails, crowds",
                      "example":  "time-lapse"
                  },
                  {
                      "id":  "slow-motion",
                      "type":  "atom",
                      "slot":  "technique",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "慢动作",
                      "en":  "slow motion",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [
                                                 "slow motion"
                                             ]
                                  },
                      "score":  {
                                    "value":  85,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [
                                                             "time-lapse"
                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "高速拍摄慢速回放，放大瞬间",
                      "descEn":  "High-speed capture played back slowly; amplifies the moment",
                      "example":  "slow motion"
                  },
                  {
                      "id":  "long-take",
                      "type":  "atom",
                      "slot":  "technique",
                      "modalities":  [
                                         "video"
                                     ],
                      "zh":  "一镜到底",
                      "en":  "long take",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  55,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [
                                                            "aerial",
                                                            "handheld"
                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "单镜头不剪辑；模型常在中途崩溃，慎用",
                      "descEn":  "One continuous shot without cuts; models often break midway — use with caution",
                      "example":  "one continuous long take"
                  },
                  {
                      "id":  "fisheye",
                      "type":  "atom",
                      "slot":  "technique",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "鱼眼镜头",
                      "en":  "fisheye lens",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  80,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "夸张桶形畸变，滑板/派对/迷幻感",
                      "descEn":  "Exaggerated barrel distortion; skate / party / psychedelic",
                      "example":  "fisheye lens distortion"
                  },
                  {
                      "id":  "vhs",
                      "type":  "atom",
                      "slot":  "technique",
                      "modalities":  [
                                         "image",
                                         "video"
                                     ],
                      "zh":  "复古录像带",
                      "en":  "VHS aesthetic",
                      "aliases":  {
                                      "zh":  [

                                             ],
                                      "en":  [

                                             ]
                                  },
                      "score":  {
                                    "value":  78,
                                    "status":  "heuristic",
                                    "confidence":  null,
                                    "benchmarkVersion":  null,
                                    "sampleSize":  0,
                                    "models":  [

                                               ],
                                    "updatedAt":  "2026-08"
                                },
                      "relations":  {
                                        "hardConflict":  [

                                                         ],
                                        "softTension":  [

                                                        ],
                                        "redundant":  [

                                                      ],
                                        "requires":  [

                                                     ],
                                        "implies":  [

                                                    ],
                                        "expandsTo":  [

                                                      ]
                                    },
                      "desc":  "老式录像带质感：扫描线、噪点、偏色",
                      "descEn":  "Old VHS look: scanlines, noise, color drift",
                      "example":  "VHS aesthetic, tracking lines"
                  }
              ],
    "name":  "视觉提示词原子词库",
    "slots":  [
                  {
                      "id":  "lighting",
                      "zh":  "光线",
                      "en":  "Lighting",
                      "order":  1,
                      "desc":  "光的方向、质感与色温，决定画面的明暗结构",
                      "descEn":  "Direction, quality and color temperature of light — defines the light-dark structure of the frame"
                  },
                  {
                      "id":  "camera",
                      "zh":  "运镜",
                      "en":  "Camera Movement",
                      "order":  2,
                      "desc":  "镜头的运动方式，决定画面的时间感与叙事节奏",
                      "descEn":  "How the camera moves — defines the sense of time and narrative rhythm"
                  },
                  {
                      "id":  "shot",
                      "zh":  "景别",
                      "en":  "Shot Size",
                      "order":  3,
                      "desc":  "镜头与被摄主体的距离，决定信息量与情绪距离",
                      "descEn":  "Distance between camera and subject — defines information density and emotional distance"
                  },
                  {
                      "id":  "composition",
                      "zh":  "构图",
                      "en":  "Composition",
                      "order":  4,
                      "desc":  "画面元素的排布规则，决定视觉重心与秩序感",
                      "descEn":  "Arrangement of elements in the frame — defines visual focus and order"
                  },
                  {
                      "id":  "color",
                      "zh":  "调色",
                      "en":  "Color Grading",
                      "order":  5,
                      "desc":  "色彩倾向与质感，决定画面情绪底色",
                      "descEn":  "Color tendency and texture — defines the emotional baseline"
                  },
                  {
                      "id":  "style",
                      "zh":  "风格",
                      "en":  "Style",
                      "order":  6,
                      "desc":  "整体视觉流派，决定画面的世界观",
                      "descEn":  "Overall visual genre — defines the world of the image"
                  },
                  {
                      "id":  "mood",
                      "zh":  "氛围",
                      "en":  "Mood",
                      "order":  7,
                      "desc":  "情绪关键词，统摄以上所有槽位的表达方向",
                      "descEn":  "Emotional keywords that steer the direction of all other slots"
                  },
                  {
                      "id":  "time",
                      "zh":  "时间",
                      "en":  "Time",
                      "order":  8,
                      "desc":  "叙事时刻与天气，决定环境光与场景逻辑",
                      "descEn":  "Narrative moment and weather — defines ambient light and scene logic"
                  },
                  {
                      "id":  "technique",
                      "zh":  "镜头技术",
                      "en":  "Lens \u0026 Technique",
                      "order":  9,
                      "desc":  "镜头参数与拍摄技法，决定光学质感",
                      "descEn":  "Lens parameters and shooting techniques — defines optical texture"
                  }
              ]
};
