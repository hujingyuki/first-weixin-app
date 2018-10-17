export function computedImgCode (type) {
  let reCode = 999
  if (type) {
    switch (type) {
      case '晴':
        reCode = 100
        break
      case '多云':
        reCode = 101
        break
      case '少云':
        reCode = 102
        break
      case '晴间多云':
        reCode = 103
        break
      case '阴':
        reCode = 104
        break
      case '有风':
        reCode = 200
        break
      case '平静':
        reCode = 201
        break
      case '微风':
        reCode = 202
        break
      case '和风':
        reCode = 203
        break
      case '清风':
        reCode = 204
        break
      case '强风':
      case '劲风':
        reCode = 205
        break
      case '疾风':
        reCode = 206
        break
      case '大风':
        reCode = 207
        break
      case '烈风':
        reCode = 208
        break
      case '风暴':
        reCode = 209
        break
      case '狂爆风':
        reCode = 210
        break
      case '飓风':
        reCode = 211
        break
      case '龙卷风':
        reCode = 212
        break
      case '热带风暴':
        reCode = 213
        break
      case '阵雨':
        reCode = 300
        break
      case '强阵雨':
        reCode = 301
        break
      case '雷阵雨':
        reCode = 302
        break
      case '强雷阵雨':
        reCode = 303
        break
      case '雷阵雨伴有冰雹':
        reCode = 304
        break
      case '小雨':
        reCode = 305
        break
      case '中雨':
        reCode = 306
        break
      case '大雨':
        reCode = 307
        break
      case '极端降雨':
        reCode = 308
        break
      case '毛毛雨':
      case '细雨':
        reCode = 309
        break
      case '暴雨':
        reCode = 310
        break
      case '大暴雨':
        reCode = 311
        break
      case '特大暴雨':
        reCode = 312
        break
      case '冻雨':
        reCode = 313
        break
      case '小到中雨':
        reCode = 314
        break
      case '中到大雨':
        reCode = 315
        break
      case '大到暴雨':
        reCode = 316
        break
      case '暴雨到大暴雨':
        reCode = 317
        break
      case '大暴雨到特大暴雨':
        reCode = 318
        break
      case '雨':
        reCode = 319
        break
      case '小雪':
        reCode = 400
        break
      case '中雪':
        reCode = 401
        break
      case '大雪':
        reCode = 402
        break
      case '暴雪':
        reCode = 403
        break
      case '雨夹雪':
        reCode = 404
        break
      case '雨雪天气':
        reCode = 405
        break
      case '阵雨夹雪':
        reCode = 406
        break
      case '阵雪':
        reCode = 407
        break
      case '小到中雪':
        reCode = 408
        break
      case '中到大雪':
        reCode = 409
        break
      case '大到暴雪':
        reCode = 410
        break
      case '雪':
        reCode = 499
        break
      case '薄雾':
        reCode = 500
        break
      case '雾':
        reCode = 501
        break
      case '霾':
        reCode = 502
        break
      case '扬沙':
        reCode = 503
        break
      case '浮尘':
        reCode = 504
        break
      case '沙尘暴':
        reCode = 507
        break
      case '强沙尘暴':
        reCode = 508
        break
      case '浓雾':
        reCode = 509
        break
      case '强浓雾':
        reCode = 510
        break
      case '中度霾':
        reCode = 511
        break
      case '重度霾':
        reCode = 512
        break
      case '严重霾':
        reCode = 513
        break
      case '大雾':
        reCode = 514
        break
      case '特强浓雾':
        reCode = 515
        break
      case '热':
        reCode = 900
        break
      case '冷':
        reCode = 901
        break
      default:break
    }
  }
  return reCode
}

export default computedImgCode
