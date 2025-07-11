import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { Log } from "./logger";

function App() {
  const [inputs, setInputs] = useState([{ longUrl: "", validity: "30", shortcode: "" }]);
  const [results, setResults] = useState([]);

  const handleInputChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addMoreInput = () => {
    if (inputs.length >= 5) {
      Log("frontend", "warn", "component", "User tried to add more than 5 URLs");
      return;
    }
    setInputs([...inputs, { longUrl: "", validity: "30", shortcode: "" }]);
  };

  const handleShorten = () => {
    const output = [];

    inputs.forEach(({ longUrl, validity, shortcode }) => {
      if (!longUrl.startsWith("http")) {
        Log("frontend", "error", "component", `Invalid URL: ${longUrl}`);
        output.push({ longUrl, error: "Invalid URL" });
        return;
      }

      const code = shortcode || Math.random().toString(36).substring(2, 8);
      const expiry = new Date(Date.now() + parseInt(validity) * 60000).toLocaleString();

      output.push({
        longUrl,
        shortUrl: `short.ly/${code}`,
        expiresAt: expiry,
      });

      Log("frontend", "info", "component", `URL shortened: ${longUrl} → ${code}`);
    });

    setResults(output);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        React URL Shortener
      </Typography>

      {inputs.map((item, index) => (
        <Box key={index} sx={{ mb: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label={`URL ${index + 1}`}
                fullWidth
                value={item.longUrl}
                onChange={(e) => handleInputChange(index, "longUrl", e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Validity (min)"
                fullWidth
                value={item.validity}
                onChange={(e) => handleInputChange(index, "validity", e.target.value)}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Shortcode (optional)"
                fullWidth
                value={item.shortcode}
                onChange={(e) => handleInputChange(index, "shortcode", e.target.value)}
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" onClick={addMoreInput} sx={{ mr: 2 }}>
          Add More
        </Button>
        <Button variant="contained" onClick={handleShorten}>
          Shorten URLs
        </Button>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Results:</Typography>
        {results.length === 0 && <Typography>No URLs shortened yet.</Typography>}
        {results.map((res, idx) => (
          <Box key={idx} sx={{ mb: 1 }}>
            {res.error ? (
              <Typography color="error">{res.error}</Typography>
            ) : (
              <>
                <Typography><b>Original:</b> {res.longUrl}</Typography>
                <Typography><b>Shortened:</b> {res.shortUrl}</Typography>
                <Typography><b>Expires At:</b> {res.expiresAt}</Typography>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default App;
