const storage_params = (req, res) => {
  const { name, contact, message } = req.body;

  const storageParams = {
    token: process.env.STORAGE_SAS_TOKEN,
    containerName: process.env.STORAGE_CONTAINER_NAME,
    accountName: process.env.STORAGE_ACCOUNT_NAME,
  };

  res.status(200).json(storageParams).end();
};

export default storage_params;
