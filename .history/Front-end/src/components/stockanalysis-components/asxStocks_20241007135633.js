// asxStocks.js

export const asxStocks = `
stock_name,ticker
BHP,BHP
Commonwealth Bank of Australia,CBA
CSL,CSL
National Australia Bank,NAB
Westpac Banking Corporation,WBC
ANZ Holdings,ANZ
Macquarie,MQG
Wesfarmers,WES
Goodman,GMG
Fortescue,FMG
Woodside Energy,WDS
RIO Tinto,RIO
Wisetech Global,WTC
Telstra,TLS
Transurban,TCL
Woolworths,WOW
Aristocrat Leisure,ALL
REA,REA
Brambles,BXB
QBE Insurance,QBE
Coles,COL
... (the rest of your CSV data here)
`;

// Function to convert CSV to a JSON-like array of objects
export const parseCsvToArray = (csv) => {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',');

  return lines.slice(1).map(line => {
    const values = line.split(',');
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index];
    });
    return obj;
  });
};

export const parsedStocksArray = parseCsvToArray(asxStocks);