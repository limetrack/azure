import { useState } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  LinearProgress,
} from '@mui/material';
import { BlobServiceClient } from '@azure/storage-blob';

export default function Index() {
  const [file, setFile] = useState(null);
  const [isFileUploaded, setFileUploaded] = useState(false);

  const getStorageParams = async () => {
    const { data: storageParams } = await axios.get("api/storage"); 

    return storageParams;
  }; 

  const createBlobInContainer = async (containerClient, file) => {
  
    // create blobClient for container
    const blobClient = containerClient.getBlockBlobClient(file.name);
  
    // set mimetype as determined from browser with file upload control
    const options = { blobHTTPHeaders: { blobContentType: file.type } };
  
    // upload file
    await blobClient.uploadData(file, options);
  }

  const uploadFileToBlob = async (file) => {
    if (!file) return [];

    const storageParams = await getStorageParams();
  
    const blobService = new BlobServiceClient(
      `https://${storageParams.accountName}.blob.core.windows.net/?${storageParams.token}`
    );
    // get Container - full public read access
    const containerClient = blobService.getContainerClient(storageParams.containerName);
  
    // upload file
    await createBlobInContainer(containerClient, file);

    setFileUploaded(true);
  };
  
  const handleFilesChange = (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    setFile(selectedFile);
    getStorageParams();
    uploadFileToBlob(selectedFile);
  }

  return (
    <Container maxWidth="sm" sx={{ height: '100vh' }}>
      <Grid container direction="column" justifyContent="center" alignItems="center" sx={{ height: '100%' }}>
        <Grid item>
          <Box sx={{ my: 4 }}>
            <Button variant="contained" component="label" color="primary">
              Upload a file
              <input
                type="file"
                hidden
                onChange={handleFilesChange}  
              />
            </Button>
          </Box>
        </Grid>
        <Grid item>
          {file && !isFileUploaded && (
            <Typography>Uploading {file?.name ?? ''}</Typography>
          )}
          {isFileUploaded && (
            <Typography>{file?.name ?? ''} has been uploaded!</Typography>
          )}
          {file && isFileUploaded && (
            <LinearProgress variant="determinate" value={100} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}
