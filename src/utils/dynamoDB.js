import AWS from 'aws-sdk';

// Set AWS credentials and region (Note: Secure credentials in production)
AWS.config.update({
  accessKeyId: 'AKIARZF7DL3WVMZIQG4N',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

const docClient = new AWS.DynamoDB.DocumentClient();
const dynamoDB = new AWS.DynamoDB();  // This is used for table-related operations
const TABLE_NAME = 'WP_Calculator-Data';

// Function to store data in DynamoDB
export const storeData = async (data) => {    
  const params = {
    TableName: TABLE_NAME,
    Item: {
      Id: data.id,
      name: data.name,
      scenarios: data.scenarios,
      fpValues: data.fpValues,
      accountValue: data.accountValue,
      fundExpenses: data.fundExpenses,
      fpPayout: data.fpPayout,
      houseHoldValue: data.houseHoldValue,
      feeType: data.feeType,
      programFee: data.programFee,
      programFeeValues: data.programFeeValues,
      strategistFeeValues: data.strategistFeeValues,
      totalAccountFeeValues: data.totalAccountFeeValues,
      totalClientFeeValues: data.totalClientFeeValues,
      grossAnnualFeeValues: data.grossAnnualFeeValues,
      netAnnualFeeValues: data.netAnnualFeeValues,
      AUAdiscount: data.AUAdiscount,
    },
  };

  try {
    await docClient.put(params).promise();
    console.log('Data stored successfully in DynamoDB');
  } catch (error) {
    console.error('Error storing data in DynamoDB:', error);
  }
};

// Function to retrieve data from DynamoDB using ID
export const retrieveData = async (id) => {
  console.log('called');
  const params = {
    TableName: TABLE_NAME,
    Key: {
      Id: id,
    },
  };

  try {
    const data = await docClient.get(params).promise();
    console.log('Data retrieved successfully from DynamoDB:', data.Item);
    console.log(id);
    return data.Item;
  } catch (error) {
    console.error('Error retrieving data from DynamoDB:', error);
  }
};
