export const localCounties = [
  { code: 'A', name: '臺北市', id: '63000000' },
  { code: 'B', name: '臺中市', id: '66000000' },
  { code: 'C', name: '基隆市', id: '10017000' },
  { code: 'D', name: '臺南市', id: '67000000' },
  { code: 'E', name: '高雄市', id: '64000000' },
  { code: 'F', name: '新北市', id: '65000000' },
  { code: 'G', name: '宜蘭縣', id: '10002000' },
  { code: 'H', name: '桃園市', id: '68000000' },
  { code: 'I', name: '嘉義市', id: '10020000' },
  { code: 'J', name: '新竹縣', id: '10004000' },
  { code: 'K', name: '苗栗縣', id: '10005000' },
  { code: 'M', name: '南投縣', id: '10008000' },
  { code: 'N', name: '彰化縣', id: '10007000' },
  { code: 'O', name: '新竹市', id: '10018000' },
  { code: 'P', name: '雲林縣', id: '10009000' },
  { code: 'Q', name: '嘉義縣', id: '10010000' },
  { code: 'T', name: '屏東縣', id: '10013000' },
  { code: 'U', name: '花蓮縣', id: '10015000' },
  { code: 'V', name: '臺東縣', id: '10014000' },
  { code: 'W', name: '金門縣', id: '09020000' },
  { code: 'X', name: '澎湖縣', id: '10016000' },
  { code: 'Z', name: '連江縣', id: '09007000' },
];

/**
 * 尋找指定縣市名稱的資料。
 * @param {String} searchKey 要尋找的縣市名稱或代碼。
 * @returns {{
 *   code: String,
 *   name: String,
 *   id: String,
 * }}
 */
export const findCounty = (searchKey) => {
  const targetName = searchKey.trim().replace('台', '臺');
  const code = searchKey.match(/[A-Z]/)?.[0];
  const result = localCounties.find((county) => (code && code === county.code) || (targetName === county.name));
  if (!result) {
    return null; // {code: '', name: '', id: ''};
  }
  return result;
};

/**
 * 尋找指定鄉鎮市區名稱的資料。
 * @param {String} searchKey 要尋找的鄉鎮市區名稱或代碼。
 * @returns {{
*   code: String,
*   name: String,
*   id: String,
* }}
*/
export const findCity = (countyCode, searchKey) => {
  const targetName = searchKey.trim();
  const code = searchKey.match(/[A-Z]\d{2}/)?.[0];
  // eslint-disable-next-line no-use-before-define
  const result = localCities[countyCode]?.find((city) => (code && code === city.code) || (targetName === city.name));
  if (result) return result;

  return null; // {code: '', name: '', id: ''};
};

export const localCities = {
  A: [
    {
      code: 'A01', name: '松山區', id: '63000010', zipCode: '105',
    },
    {
      code: 'A17', name: '信義區', id: '63000020', zipCode: '110',
    },
    {
      code: 'A02', name: '大安區', id: '63000030', zipCode: '106',
    },
    {
      code: 'A10', name: '中山區', id: '63000040', zipCode: '104',
    },
    {
      code: 'A03', name: '中正區', id: '63000050', zipCode: '100',
    },
    {
      code: 'A09', name: '大同區', id: '63000060', zipCode: '103',
    },
    {
      code: 'A05', name: '萬華區', id: '63000070', zipCode: '108',
    },
    {
      code: 'A11', name: '文山區', id: '63000080', zipCode: '116',
    },
    {
      code: 'A13', name: '南港區', id: '63000090', zipCode: '115',
    },
    {
      code: 'A14', name: '內湖區', id: '63000100', zipCode: '114',
    },
    {
      code: 'A15', name: '士林區', id: '63000110', zipCode: '111',
    },
    {
      code: 'A16', name: '北投區', id: '63000120', zipCode: '112',
    },
  ],

  B: [
    {
      code: 'B01', name: '中區', id: '66000010', zipCode: '400',
    },
    {
      code: 'B02', name: '東區', id: '66000020', zipCode: '401',
    },
    {
      code: 'B03', name: '南區', id: '66000030', zipCode: '402',
    },
    {
      code: 'B04', name: '西區', id: '66000040', zipCode: '403',
    },
    {
      code: 'B05', name: '北區', id: '66000050', zipCode: '404',
    },
    {
      code: 'B06', name: '西屯區', id: '66000060', zipCode: '407',
    },
    {
      code: 'B07', name: '南屯區', id: '66000070', zipCode: '408',
    },
    {
      code: 'B08', name: '北屯區', id: '66000080', zipCode: '406',
    },
    {
      code: 'B09', name: '豐原區', id: '66000090', zipCode: '420',
    },
    {
      code: 'B10', name: '東勢區', id: '66000100', zipCode: '423',
    },
    {
      code: 'B11', name: '大甲區', id: '66000110', zipCode: '437',
    },
    {
      code: 'B12', name: '清水區', id: '66000120', zipCode: '436',
    },
    {
      code: 'B13', name: '沙鹿區', id: '66000130', zipCode: '433',
    },
    {
      code: 'B14', name: '梧棲區', id: '66000140', zipCode: '435',
    },
    {
      code: 'B15', name: '后里區', id: '66000150', zipCode: '421',
    },
    {
      code: 'B16', name: '神岡區', id: '66000160', zipCode: '429',
    },
    {
      code: 'B17', name: '潭子區', id: '66000170', zipCode: '427',
    },
    {
      code: 'B18', name: '大雅區', id: '66000180', zipCode: '428',
    },
    {
      code: 'B19', name: '新社區', id: '66000190', zipCode: '426',
    },
    {
      code: 'B20', name: '石岡區', id: '66000200', zipCode: '422',
    },
    {
      code: 'B21', name: '外埔區', id: '66000210', zipCode: '438',
    },
    {
      code: 'B22', name: '大安區', id: '66000220', zipCode: '439',
    },
    {
      code: 'B23', name: '烏日區', id: '66000230', zipCode: '414',
    },
    {
      code: 'B24', name: '大肚區', id: '66000240', zipCode: '432',
    },
    {
      code: 'B25', name: '龍井區', id: '66000250', zipCode: '434',
    },
    {
      code: 'B26', name: '霧峰區', id: '66000260', zipCode: '413',
    },
    {
      code: 'B27', name: '太平區', id: '66000270', zipCode: '411',
    },
    {
      code: 'B28', name: '大里區', id: '66000280', zipCode: '412',
    },
    {
      code: 'B29', name: '和平區', id: '66000290', zipCode: '424',
    },
  ],

  C: [
    {
      code: 'C01', name: '中正區', id: '10017010', zipCode: '202',
    },
    {
      code: 'C02', name: '七堵區', id: '10017020', zipCode: '206',
    },
    {
      code: 'C03', name: '暖暖區', id: '10017030', zipCode: '205',
    },
    {
      code: 'C04', name: '仁愛區', id: '10017040', zipCode: '200',
    },
    {
      code: 'C05', name: '中山區', id: '10017050', zipCode: '203',
    },
    {
      code: 'C06', name: '安樂區', id: '10017060', zipCode: '204',
    },
    {
      code: 'C07', name: '信義區', id: '10017070', zipCode: '201',
    },
  ],

  D: [
    {
      code: 'D09', name: '新營區', id: '67000010', zipCode: '730',
    },
    {
      code: 'D10', name: '鹽水區', id: '67000020', zipCode: '737',
    },
    {
      code: 'D12', name: '白河區', id: '67000030', zipCode: '732',
    },
    {
      code: 'D11', name: '柳營區', id: '67000040', zipCode: '736',
    },
    {
      code: 'D13', name: '後壁區', id: '67000050', zipCode: '731',
    },
    {
      code: 'D14', name: '東山區', id: '67000060', zipCode: '733',
    },
    {
      code: 'D15', name: '麻豆區', id: '67000070', zipCode: '721',
    },
    {
      code: 'D16', name: '下營區', id: '67000080', zipCode: '735',
    },
    {
      code: 'D17', name: '六甲區', id: '67000090', zipCode: '734',
    },
    {
      code: 'D18', name: '官田區', id: '67000100', zipCode: '720',
    },
    {
      code: 'D19', name: '大內區', id: '67000110', zipCode: '742',
    },
    {
      code: 'D20', name: '佳里區', id: '67000120', zipCode: '722',
    },
    {
      code: 'D25', name: '學甲區', id: '67000130', zipCode: '726',
    },
    {
      code: 'D21', name: '西港區', id: '67000140', zipCode: '723',
    },
    {
      code: 'D22', name: '七股區', id: '67000150', zipCode: '724',
    },
    {
      code: 'D23', name: '將軍區', id: '67000160', zipCode: '725',
    },
    {
      code: 'D24', name: '北門區', id: '67000170', zipCode: '727',
    },
    {
      code: 'D26', name: '新化區', id: '67000180', zipCode: '712',
    },
    {
      code: 'D27', name: '善化區', id: '67000190', zipCode: '741',
    },
    {
      code: 'D28', name: '新市區', id: '67000200', zipCode: '744',
    },
    {
      code: 'D29', name: '安定區', id: '67000210', zipCode: '745',
    },
    {
      code: 'D30', name: '山上區', id: '67000220', zipCode: '743',
    },
    {
      code: 'D36', name: '玉井區', id: '67000230', zipCode: '714',
    },
    {
      code: 'D37', name: '楠西區', id: '67000240', zipCode: '715',
    },
    {
      code: 'D38', name: '南化區', id: '67000250', zipCode: '716',
    },
    {
      code: 'D31', name: '左鎮區', id: '67000260', zipCode: '713',
    },
    {
      code: 'D32', name: '仁德區', id: '67000270', zipCode: '717',
    },
    {
      code: 'D33', name: '歸仁區', id: '67000280', zipCode: '711',
    },
    {
      code: 'D34', name: '關廟區', id: '67000290', zipCode: '718',
    },
    {
      code: 'D35', name: '龍崎區', id: '67000300', zipCode: '719',
    },
    {
      code: 'D39', name: '永康區', id: '67000310', zipCode: '710',
    },
    {
      code: 'D01', name: '東區', id: '67000320', zipCode: '701',
    },
    {
      code: 'D02', name: '南區', id: '67000330', zipCode: '702',
    },
    {
      code: 'D04', name: '北區', id: '67000340', zipCode: '704',
    },
    {
      code: 'D06', name: '安南區', id: '67000350', zipCode: '709',
    },
    {
      code: 'D07', name: '安平區', id: '67000360', zipCode: '708',
    },
    {
      code: 'D08', name: '中西區', id: '67000370', zipCode: '700',
    },
  ],

  E: [
    {
      code: 'E01', name: '鹽埕區', id: '64000010', zipCode: '803',
    },
    {
      code: 'E02', name: '鼓山區', id: '64000020', zipCode: '804',
    },
    {
      code: 'E03', name: '左營區', id: '64000030', zipCode: '813',
    },
    {
      code: 'E04', name: '楠梓區', id: '64000040', zipCode: '811',
    },
    {
      code: 'E05', name: '三民區', id: '64000050', zipCode: '807',
    },
    {
      code: 'E06', name: '新興區', id: '64000060', zipCode: '800',
    },
    {
      code: 'E07', name: '前金區', id: '64000070', zipCode: '801',
    },
    {
      code: 'E08', name: '苓雅區', id: '64000080', zipCode: '802',
    },
    {
      code: 'E09', name: '前鎮區', id: '64000090', zipCode: '806',
    },
    {
      code: 'E10', name: '旗津區', id: '64000100', zipCode: '805',
    },
    {
      code: 'E11', name: '小港區', id: '64000110', zipCode: '812',
    },
    {
      code: 'E12', name: '鳳山區', id: '64000120', zipCode: '830',
    },
    {
      code: 'E13', name: '林園區', id: '64000130', zipCode: '832',
    },
    {
      code: 'E14', name: '大寮區', id: '64000140', zipCode: '831',
    },
    {
      code: 'E15', name: '大樹區', id: '64000150', zipCode: '840',
    },
    {
      code: 'E16', name: '大社區', id: '64000160', zipCode: '815',
    },
    {
      code: 'E17', name: '仁武區', id: '64000170', zipCode: '814',
    },
    {
      code: 'E18', name: '鳥松區', id: '64000180', zipCode: '833',
    },
    {
      code: 'E19', name: '岡山區', id: '64000190', zipCode: '820',
    },
    {
      code: 'E20', name: '橋頭區', id: '64000200', zipCode: '825',
    },
    {
      code: 'E21', name: '燕巢區', id: '64000210', zipCode: '824',
    },
    {
      code: 'E22', name: '田寮區', id: '64000220', zipCode: '823',
    },
    {
      code: 'E23', name: '阿蓮區', id: '64000230', zipCode: '822',
    },
    {
      code: 'E24', name: '路竹區', id: '64000240', zipCode: '821',
    },
    {
      code: 'E25', name: '湖內區', id: '64000250', zipCode: '829',
    },
    {
      code: 'E26', name: '茄萣區', id: '64000260', zipCode: '852',
    },
    {
      code: 'E27', name: '永安區', id: '64000270', zipCode: '828',
    },
    {
      code: 'E28', name: '彌陀區', id: '64000280', zipCode: '827',
    },
    {
      code: 'E29', name: '梓官區', id: '64000290', zipCode: '826',
    },
    {
      code: 'E30', name: '旗山區', id: '64000300', zipCode: '842',
    },
    {
      code: 'E31', name: '美濃區', id: '64000310', zipCode: '843',
    },
    {
      code: 'E32', name: '六龜區', id: '64000320', zipCode: '844',
    },
    {
      code: 'E33', name: '甲仙區', id: '64000330', zipCode: '847',
    },
    {
      code: 'E34', name: '杉林區', id: '64000340', zipCode: '846',
    },
    {
      code: 'E35', name: '內門區', id: '64000350', zipCode: '845',
    },
    {
      code: 'E36', name: '茂林區', id: '64000360', zipCode: '851',
    },
    {
      code: 'E37', name: '桃源區', id: '64000370', zipCode: '848',
    },
    {
      code: 'E38', name: '那瑪夏區', id: '64000380', zipCode: '849',
    },
  ],

  F: [
    {
      code: 'F14', name: '板橋區', id: '65000010', zipCode: '220',
    },
    {
      code: 'F05', name: '三重區', id: '65000020', zipCode: '241',
    },
    {
      code: 'F18', name: '中和區', id: '65000030', zipCode: '235',
    },
    {
      code: 'F33', name: '永和區', id: '65000040', zipCode: '234',
    },
    {
      code: 'F01', name: '新莊區', id: '65000050', zipCode: '242',
    },
    {
      code: 'F07', name: '新店區', id: '65000060', zipCode: '231',
    },
    {
      code: 'F17', name: '樹林區', id: '65000070', zipCode: '238',
    },
    {
      code: 'F16', name: '鶯歌區', id: '65000080', zipCode: '239',
    },
    {
      code: 'F15', name: '三峽區', id: '65000090', zipCode: '237',
    },
    {
      code: 'F27', name: '淡水區', id: '65000100', zipCode: '251',
    },
    {
      code: 'F28', name: '汐止區', id: '65000110', zipCode: '221',
    },
    {
      code: 'F21', name: '瑞芳區', id: '65000120', zipCode: '224',
    },
    {
      code: 'F19', name: '土城區', id: '65000130', zipCode: '236',
    },
    {
      code: 'F04', name: '蘆洲區', id: '65000140', zipCode: '247',
    },
    {
      code: 'F03', name: '五股區', id: '65000150', zipCode: '248',
    },
    {
      code: 'F06', name: '泰山區', id: '65000160', zipCode: '243',
    },
    {
      code: 'F02', name: '林口區', id: '65000170', zipCode: '244',
    },
    {
      code: 'F09', name: '深坑區', id: '65000180', zipCode: '222',
    },
    {
      code: 'F08', name: '石碇區', id: '65000190', zipCode: '223',
    },
    {
      code: 'F10', name: '坪林區', id: '65000200', zipCode: '232',
    },
    {
      code: 'F30', name: '三芝區', id: '65000210', zipCode: '252',
    },
    {
      code: 'F31', name: '石門區', id: '65000220', zipCode: '253',
    },
    {
      code: 'F32', name: '八里區', id: '65000230', zipCode: '249',
    },
    {
      code: 'F22', name: '平溪區', id: '65000240', zipCode: '226',
    },
    {
      code: 'F23', name: '雙溪區', id: '65000250', zipCode: '227',
    },
    {
      code: 'F24', name: '貢寮區', id: '65000260', zipCode: '228',
    },
    {
      code: 'F25', name: '金山區', id: '65000270', zipCode: '208',
    },
    {
      code: 'F26', name: '萬里區', id: '65000280', zipCode: '207',
    },
    {
      code: 'F11', name: '烏來區', id: '65000290', zipCode: '233',
    },
  ],

  G: [
    {
      code: 'G01', name: '宜蘭市', id: '10002010', zipCode: '260',
    },
    {
      code: 'G06', name: '羅東鎮', id: '10002020', zipCode: '265',
    },
    {
      code: 'G09', name: '蘇澳鎮', id: '10002030', zipCode: '270',
    },
    {
      code: 'G02', name: '頭城鎮', id: '10002040', zipCode: '261',
    },
    {
      code: 'G03', name: '礁溪鄉', id: '10002050', zipCode: '262',
    },
    {
      code: 'G04', name: '壯圍鄉', id: '10002060', zipCode: '263',
    },
    {
      code: 'G05', name: '員山鄉', id: '10002070', zipCode: '264',
    },
    {
      code: 'G08', name: '冬山鄉', id: '10002080', zipCode: '269',
    },
    {
      code: 'G07', name: '五結鄉', id: '10002090', zipCode: '268',
    },
    {
      code: 'G10', name: '三星鄉', id: '10002100', zipCode: '266',
    },
    {
      code: 'G11', name: '大同鄉', id: '10002110', zipCode: '267',
    },
    {
      code: 'G12', name: '南澳鄉', id: '10002120', zipCode: '272',
    },
  ],

  H: [
    {
      code: 'H01', name: '桃園區', id: '68000010', zipCode: '330',
    },
    {
      code: 'H03', name: '中壢區', id: '68000020', zipCode: '320',
    },
    {
      code: 'H02', name: '大溪區', id: '68000030', zipCode: '335',
    },
    {
      code: 'H04', name: '楊梅區', id: '68000040', zipCode: '326',
    },
    {
      code: 'H05', name: '蘆竹區', id: '68000050', zipCode: '338',
    },
    {
      code: 'H06', name: '大園區', id: '68000060', zipCode: '337',
    },
    {
      code: 'H07', name: '龜山區', id: '68000070', zipCode: '333',
    },
    {
      code: 'H08', name: '八德區', id: '68000080', zipCode: '334',
    },
    {
      code: 'H09', name: '龍潭區', id: '68000090', zipCode: '325',
    },
    {
      code: 'H10', name: '平鎮區', id: '68000100', zipCode: '324',
    },
    {
      code: 'H11', name: '新屋區', id: '68000110', zipCode: '327',
    },
    {
      code: 'H12', name: '觀音區', id: '68000120', zipCode: '328',
    },
    {
      code: 'H13', name: '復興區', id: '68000130', zipCode: '336',
    },
  ],

  I: [
    {
      code: 'I01', name: '東區', id: '10020010', zipCode: '600',
    },
    {
      code: 'I02', name: '西區', id: '10020020', zipCode: '600',
    },
  ],

  J: [
    {
      code: 'J05', name: '竹北市', id: '10004010', zipCode: '302',
    },
    {
      code: 'J02', name: '竹東鎮', id: '10004020', zipCode: '310',
    },
    {
      code: 'J04', name: '新埔鎮', id: '10004030', zipCode: '305',
    },
    {
      code: 'J03', name: '關西鎮', id: '10004040', zipCode: '306',
    },
    {
      code: 'J06', name: '湖口鄉', id: '10004050', zipCode: '303',
    },
    {
      code: 'J09', name: '新豐鄉', id: '10004060', zipCode: '304',
    },
    {
      code: 'J10', name: '芎林鄉', id: '10004070', zipCode: '307',
    },
    {
      code: 'J08', name: '橫山鄉', id: '10004080', zipCode: '312',
    },
    {
      code: 'J12', name: '北埔鄉', id: '10004090', zipCode: '314',
    },
    {
      code: 'J11', name: '寶山鄉', id: '10004100', zipCode: '308',
    },
    {
      code: 'J13', name: '峨眉鄉', id: '10004110', zipCode: '315',
    },
    {
      code: 'J14', name: '尖石鄉', id: '10004120', zipCode: '313',
    },
    {
      code: 'J15', name: '五峰鄉', id: '10004130', zipCode: '311',
    },
  ],

  K: [
    {
      code: 'K01', name: '苗栗市', id: '10005010', zipCode: '360',
    },
    {
      code: 'K02', name: '苑裡鎮', id: '10005020', zipCode: '358',
    },
    {
      code: 'K03', name: '通霄鎮', id: '10005030', zipCode: '357',
    },
    {
      code: 'K09', name: '竹南鎮', id: '10005040', zipCode: '350',
    },
    {
      code: 'K10', name: '頭份市', id: '10005050', zipCode: '351',
    },
    {
      code: 'K12', name: '後龍鎮', id: '10005060', zipCode: '356',
    },
    {
      code: 'K16', name: '卓蘭鎮', id: '10005070', zipCode: '369',
    },
    {
      code: 'K15', name: '大湖鄉', id: '10005080', zipCode: '364',
    },
    {
      code: 'K04', name: '公館鄉', id: '10005090', zipCode: '363',
    },
    {
      code: 'K05', name: '銅鑼鄉', id: '10005100', zipCode: '366',
    },
    {
      code: 'K14', name: '南庄鄉', id: '10005110', zipCode: '353',
    },
    {
      code: 'K08', name: '頭屋鄉', id: '10005120', zipCode: '362',
    },
    {
      code: 'K06', name: '三義鄉', id: '10005130', zipCode: '367',
    },
    {
      code: 'K07', name: '西湖鄉', id: '10005140', zipCode: '368',
    },
    {
      code: 'K11', name: '造橋鄉', id: '10005150', zipCode: '361',
    },
    {
      code: 'K13', name: '三灣鄉', id: '10005160', zipCode: '352',
    },
    {
      code: 'K17', name: '獅潭鄉', id: '10005170', zipCode: '354',
    },
    {
      code: 'K18', name: '泰安鄉', id: '10005180', zipCode: '365',
    },
  ],

  M: [
    {
      code: 'M01', name: '南投市', id: '10008010', zipCode: '540',
    },
    {
      code: 'M02', name: '埔里鎮', id: '10008020', zipCode: '545',
    },
    {
      code: 'M03', name: '草屯鎮', id: '10008030', zipCode: '542',
    },
    {
      code: 'M04', name: '竹山鎮', id: '10008040', zipCode: '557',
    },
    {
      code: 'M05', name: '集集鎮', id: '10008050', zipCode: '552',
    },
    {
      code: 'M06', name: '名間鄉', id: '10008060', zipCode: '551',
    },
    {
      code: 'M07', name: '鹿谷鄉', id: '10008070', zipCode: '558',
    },
    {
      code: 'M08', name: '中寮鄉', id: '10008080', zipCode: '541',
    },
    {
      code: 'M09', name: '魚池鄉', id: '10008090', zipCode: '555',
    },
    {
      code: 'M10', name: '國姓鄉', id: '10008100', zipCode: '544',
    },
    {
      code: 'M11', name: '水里鄉', id: '10008110', zipCode: '553',
    },
    {
      code: 'M12', name: '信義鄉', id: '10008120', zipCode: '556',
    },
    {
      code: 'M13', name: '仁愛鄉', id: '10008130', zipCode: '546',
    },
  ],

  N: [
    {
      code: 'N01', name: '彰化市', id: '10007010', zipCode: '500',
    },
    {
      code: 'N02', name: '鹿港鎮', id: '10007020', zipCode: '505',
    },
    {
      code: 'N03', name: '和美鎮', id: '10007030', zipCode: '508',
    },
    {
      code: 'N09', name: '線西鄉', id: '10007040', zipCode: '507',
    },
    {
      code: 'N10', name: '伸港鄉', id: '10007050', zipCode: '509',
    },
    {
      code: 'N11', name: '福興鄉', id: '10007060', zipCode: '506',
    },
    {
      code: 'N12', name: '秀水鄉', id: '10007070', zipCode: '504',
    },
    {
      code: 'N13', name: '花壇鄉', id: '10007080', zipCode: '503',
    },
    {
      code: 'N14', name: '芬園鄉', id: '10007090', zipCode: '502',
    },
    {
      code: 'N05', name: '員林市', id: '10007100', zipCode: '510',
    },
    {
      code: 'N06', name: '溪湖鎮', id: '10007110', zipCode: '514',
    },
    {
      code: 'N07', name: '田中鎮', id: '10007120', zipCode: '520',
    },
    {
      code: 'N15', name: '大村鄉', id: '10007130', zipCode: '515',
    },
    {
      code: 'N16', name: '埔鹽鄉', id: '10007140', zipCode: '516',
    },
    {
      code: 'N17', name: '埔心鄉', id: '10007150', zipCode: '513',
    },
    {
      code: 'N18', name: '永靖鄉', id: '10007160', zipCode: '512',
    },
    {
      code: 'N19', name: '社頭鄉', id: '10007170', zipCode: '511',
    },
    {
      code: 'N20', name: '二水鄉', id: '10007180', zipCode: '530',
    },
    {
      code: 'N04', name: '北斗鎮', id: '10007190', zipCode: '521',
    },
    {
      code: 'N08', name: '二林鎮', id: '10007200', zipCode: '526',
    },
    {
      code: 'N21', name: '田尾鄉', id: '10007210', zipCode: '522',
    },
    {
      code: 'N22', name: '埤頭鄉', id: '10007220', zipCode: '523',
    },
    {
      code: 'N23', name: '芳苑鄉', id: '10007230', zipCode: '528',
    },
    {
      code: 'N24', name: '大城鄉', id: '10007240', zipCode: '527',
    },
    {
      code: 'N25', name: '竹塘鄉', id: '10007250', zipCode: '525',
    },
    {
      code: 'N26', name: '溪州鄉', id: '10007260', zipCode: '524',
    },
  ],

  O: [
    {
      code: 'O01', name: '東區', id: '10018010', zipCode: '300',
    },
    {
      code: 'O02', name: '北區', id: '10018020', zipCode: '300',
    },
    {
      code: 'O03', name: '香山區', id: '10018030', zipCode: '300',
    },
  ],

  P: [
    {
      code: 'P01', name: '斗六市', id: '10009010', zipCode: '640',
    },
    {
      code: 'P02', name: '斗南鎮', id: '10009020', zipCode: '630',
    },
    {
      code: 'P03', name: '虎尾鎮', id: '10009030', zipCode: '632',
    },
    {
      code: 'P04', name: '西螺鎮', id: '10009040', zipCode: '648',
    },
    {
      code: 'P05', name: '土庫鎮', id: '10009050', zipCode: '633',
    },
    {
      code: 'P06', name: '北港鎮', id: '10009060', zipCode: '651',
    },
    {
      code: 'P07', name: '古坑鄉', id: '10009070', zipCode: '646',
    },
    {
      code: 'P08', name: '大埤鄉', id: '10009080', zipCode: '631',
    },
    {
      code: 'P09', name: '莿桐鄉', id: '10009090', zipCode: '647',
    },
    {
      code: 'P10', name: '林內鄉', id: '10009100', zipCode: '643',
    },
    {
      code: 'P11', name: '二崙鄉', id: '10009110', zipCode: '649',
    },
    {
      code: 'P12', name: '崙背鄉', id: '10009120', zipCode: '637',
    },
    {
      code: 'P13', name: '麥寮鄉', id: '10009130', zipCode: '638',
    },
    {
      code: 'P14', name: '東勢鄉', id: '10009140', zipCode: '635',
    },
    {
      code: 'P15', name: '褒忠鄉', id: '10009150', zipCode: '634',
    },
    {
      code: 'P16', name: '臺西鄉', id: '10009160', zipCode: '636',
    },
    {
      code: 'P17', name: '元長鄉', id: '10009170', zipCode: '655',
    },
    {
      code: 'P18', name: '四湖鄉', id: '10009180', zipCode: '654',
    },
    {
      code: 'P19', name: '口湖鄉', id: '10009190', zipCode: '653',
    },
    {
      code: 'P20', name: '水林鄉', id: '10009200', zipCode: '652',
    },
  ],

  Q: [
    {
      code: 'Q12', name: '太保市', id: '10010010', zipCode: '612',
    },
    {
      code: 'Q02', name: '朴子市', id: '10010020', zipCode: '613',
    },
    {
      code: 'Q03', name: '布袋鎮', id: '10010030', zipCode: '625',
    },
    {
      code: 'Q04', name: '大林鎮', id: '10010040', zipCode: '622',
    },
    {
      code: 'Q05', name: '民雄鄉', id: '10010050', zipCode: '621',
    },
    {
      code: 'Q06', name: '溪口鄉', id: '10010060', zipCode: '623',
    },
    {
      code: 'Q07', name: '新港鄉', id: '10010070', zipCode: '616',
    },
    {
      code: 'Q08', name: '六腳鄉', id: '10010080', zipCode: '615',
    },
    {
      code: 'Q09', name: '東石鄉', id: '10010090', zipCode: '614',
    },
    {
      code: 'Q10', name: '義竹鄉', id: '10010100', zipCode: '624',
    },
    {
      code: 'Q11', name: '鹿草鄉', id: '10010110', zipCode: '611',
    },
    {
      code: 'Q13', name: '水上鄉', id: '10010120', zipCode: '608',
    },
    {
      code: 'Q14', name: '中埔鄉', id: '10010130', zipCode: '606',
    },
    {
      code: 'Q15', name: '竹崎鄉', id: '10010140', zipCode: '604',
    },
    {
      code: 'Q16', name: '梅山鄉', id: '10010150', zipCode: '603',
    },
    {
      code: 'Q17', name: '番路鄉', id: '10010160', zipCode: '602',
    },
    {
      code: 'Q18', name: '大埔鄉', id: '10010170', zipCode: '607',
    },
    {
      code: 'Q20', name: '阿里山鄉', id: '10010180', zipCode: '605',
    },
  ],

  T: [
    {
      code: 'T01', name: '屏東市', id: '10013010', zipCode: '900',
    },
    {
      code: 'T02', name: '潮州鎮', id: '10013020', zipCode: '920',
    },
    {
      code: 'T03', name: '東港鎮', id: '10013030', zipCode: '928',
    },
    {
      code: 'T04', name: '恆春鎮', id: '10013040', zipCode: '946',
    },
    {
      code: 'T05', name: '萬丹鄉', id: '10013050', zipCode: '913',
    },
    {
      code: 'T06', name: '長治鄉', id: '10013060', zipCode: '908',
    },
    {
      code: 'T07', name: '麟洛鄉', id: '10013070', zipCode: '909',
    },
    {
      code: 'T08', name: '九如鄉', id: '10013080', zipCode: '904',
    },
    {
      code: 'T09', name: '里港鄉', id: '10013090', zipCode: '905',
    },
    {
      code: 'T10', name: '鹽埔鄉', id: '10013100', zipCode: '907',
    },
    {
      code: 'T11', name: '高樹鄉', id: '10013110', zipCode: '906',
    },
    {
      code: 'T12', name: '萬巒鄉', id: '10013120', zipCode: '923',
    },
    {
      code: 'T13', name: '內埔鄉', id: '10013130', zipCode: '912',
    },
    {
      code: 'T14', name: '竹田鄉', id: '10013140', zipCode: '911',
    },
    {
      code: 'T15', name: '新埤鄉', id: '10013150', zipCode: '925',
    },
    {
      code: 'T16', name: '枋寮鄉', id: '10013160', zipCode: '940',
    },
    {
      code: 'T17', name: '新園鄉', id: '10013170', zipCode: '932',
    },
    {
      code: 'T18', name: '崁頂鄉', id: '10013180', zipCode: '924',
    },
    {
      code: 'T19', name: '林邊鄉', id: '10013190', zipCode: '927',
    },
    {
      code: 'T20', name: '南州鄉', id: '10013200', zipCode: '926',
    },
    {
      code: 'T21', name: '佳冬鄉', id: '10013210', zipCode: '931',
    },
    {
      code: 'T22', name: '琉球鄉', id: '10013220', zipCode: '929',
    },
    {
      code: 'T23', name: '車城鄉', id: '10013230', zipCode: '944',
    },
    {
      code: 'T24', name: '滿州鄉', id: '10013240', zipCode: '947',
    },
    {
      code: 'T25', name: '枋山鄉', id: '10013250', zipCode: '941',
    },
    {
      code: 'T26', name: '三地門鄉', id: '10013260', zipCode: '901',
    },
    {
      code: 'T27', name: '霧臺鄉', id: '10013270', zipCode: '902',
    },
    {
      code: 'T28', name: '瑪家鄉', id: '10013280', zipCode: '903',
    },
    {
      code: 'T29', name: '泰武鄉', id: '10013290', zipCode: '921',
    },
    {
      code: 'T30', name: '來義鄉', id: '10013300', zipCode: '922',
    },
    {
      code: 'T31', name: '春日鄉', id: '10013310', zipCode: '942',
    },
    {
      code: 'T32', name: '獅子鄉', id: '10013320', zipCode: '943',
    },
    {
      code: 'T33', name: '牡丹鄉', id: '10013330', zipCode: '945',
    },
  ],

  U: [
    {
      code: 'U01', name: '花蓮市', id: '10015010', zipCode: '970',
    },
    {
      code: 'U07', name: '鳳林鎮', id: '10015020', zipCode: '975',
    },
    {
      code: 'U03', name: '玉里鎮', id: '10015030', zipCode: '981',
    },
    {
      code: 'U04', name: '新城鄉', id: '10015040', zipCode: '971',
    },
    {
      code: 'U05', name: '吉安鄉', id: '10015050', zipCode: '973',
    },
    {
      code: 'U06', name: '壽豐鄉', id: '10015060', zipCode: '974',
    },
    {
      code: 'U02', name: '光復鄉', id: '10015070', zipCode: '976',
    },
    {
      code: 'U08', name: '豐濱鄉', id: '10015080', zipCode: '977',
    },
    {
      code: 'U09', name: '瑞穗鄉', id: '10015090', zipCode: '978',
    },
    {
      code: 'U10', name: '富里鄉', id: '10015100', zipCode: '983',
    },
    {
      code: 'U11', name: '秀林鄉', id: '10015110', zipCode: '972',
    },
    {
      code: 'U12', name: '萬榮鄉', id: '10015120', zipCode: '979',
    },
    {
      code: 'U13', name: '卓溪鄉', id: '10015130', zipCode: '982',
    },
  ],

  V: [
    {
      code: 'V01', name: '臺東市', id: '10014010', zipCode: '950',
    },
    {
      code: 'V02', name: '成功鎮', id: '10014020', zipCode: '961',
    },
    {
      code: 'V03', name: '關山鎮', id: '10014030', zipCode: '956',
    },
    {
      code: 'V04', name: '卑南鄉', id: '10014040', zipCode: '954',
    },
    {
      code: 'V09', name: '鹿野鄉', id: '10014050', zipCode: '955',
    },
    {
      code: 'V10', name: '池上鄉', id: '10014060', zipCode: '958',
    },
    {
      code: 'V07', name: '東河鄉', id: '10014070', zipCode: '959',
    },
    {
      code: 'V08', name: '長濱鄉', id: '10014080', zipCode: '962',
    },
    {
      code: 'V06', name: '太麻里鄉', id: '10014090', zipCode: '963',
    },
    {
      code: 'V05', name: '大武鄉', id: '10014100', zipCode: '965',
    },
    {
      code: 'V11', name: '綠島鄉', id: '10014110', zipCode: '951',
    },
    {
      code: 'V13', name: '海端鄉', id: '10014120', zipCode: '957',
    },
    {
      code: 'V12', name: '延平鄉', id: '10014130', zipCode: '953',
    },
    {
      code: 'V15', name: '金峰鄉', id: '10014140', zipCode: '964',
    },
    {
      code: 'V14', name: '達仁鄉', id: '10014150', zipCode: '966',
    },
    {
      code: 'V16', name: '蘭嶼鄉', id: '10014160', zipCode: '952',
    },
  ],

  W: [
    {
      code: 'W03', name: '金城鎮', id: '09020010', zipCode: '893',
    },
    {
      code: 'W02', name: '金沙鎮', id: '09020020', zipCode: '890',
    },
    {
      code: 'W01', name: '金湖鎮', id: '09020030', zipCode: '891',
    },
    {
      code: 'W04', name: '金寧鄉', id: '09020040', zipCode: '892',
    },
    {
      code: 'W05', name: '烈嶼鄉', id: '09020050', zipCode: '894',
    },
    {
      code: 'W06', name: '烏坵鄉', id: '09020060', zipCode: '896',
    },
  ],

  X: [
    {
      code: 'X01', name: '馬公市', id: '10016010', zipCode: '880',
    },
    {
      code: 'X02', name: '湖西鄉', id: '10016020', zipCode: '885',
    },
    {
      code: 'X03', name: '白沙鄉', id: '10016030', zipCode: '884',
    },
    {
      code: 'X04', name: '西嶼鄉', id: '10016040', zipCode: '881',
    },
    {
      code: 'X05', name: '望安鄉', id: '10016050', zipCode: '882',
    },
    {
      code: 'X06', name: '七美鄉', id: '10016060', zipCode: '883',
    },
  ],

  Z: [
    {
      code: 'Z01', name: '南竿鄉', id: '09007010', zipCode: '209',
    },
    {
      code: 'Z02', name: '北竿鄉', id: '09007020', zipCode: '210',
    },
    {
      code: 'Z03', name: '莒光鄉', id: '09007030', zipCode: '211',
    },
    {
      code: 'Z04', name: '東引鄉', id: '09007040', zipCode: '212',
    },
  ],

};
