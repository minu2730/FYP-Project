const axios = require('axios');
const FormData = require('form-data');
const { Blob } = require('buffer');

const HOSTNAME = 'storage.bunnycdn.com';
const STORAGE_ZONE_NAME = 'mlmstoragezoon';
const ACCESS_KEY = 'b1f97b41-545b-47c6-8e6e8515d99f-210b-4b1c';

const uploadFile = async (file) => {
  try {
    const data = new FormData();
    data.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    data.append('upload_preset', 'qrAttendance');

    const response = await axios.post(
      'https://api.cloudinary.com/v1_1/dwgehqnsz/image/upload',
      data,
      {
        headers: {
          ...data.getHeaders(),
        },
      },
    );

    return response.data.url;
  } catch (error) {
	console.log(error)
  }
};

module.exports = uploadFile;
