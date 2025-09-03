export const normalizeApiResponse = (responseData) => {
  console.log('Normalizing API response:', responseData);
  
  if (Array.isArray(responseData)) {
    return responseData;
  }
  
  if (responseData && typeof responseData === 'object' && Array.isArray(responseData.results)) {
    return responseData.results;
  }
  
  if (responseData && typeof responseData === 'object' && Array.isArray(responseData.data)) {
    return responseData.data;
  }
  
  if (responseData && typeof responseData === 'object') {
    const arrayKeys = Object.keys(responseData).filter(key => Array.isArray(responseData[key]));
    if (arrayKeys.length > 0) {
      return responseData[arrayKeys[0]];
    }
  }
  
  console.error('Could not normalize API response:', responseData);
  return [];
};

export const safeMap = (data, callback) => {
  if (!Array.isArray(data)) {
    console.error('Attempted to map non-array data:', data);
    return [];
  }
  return data.map(callback);
};