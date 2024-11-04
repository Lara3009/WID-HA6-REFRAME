import {
  Button,
  Typography,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  Alert,
} from "@mui/material";
import React, { useState } from "react";

const URL = "https://geodesy.geo.admin.ch/reframe";

function KoordinatenTransformieren() {
  const [dienst, setDienst] = useState("lv95towgs84");
  const [ostwert, setOstwert] = useState("");
  const [nordwert, setNordwert] = useState("");
  const [transformierteX, setTransformierteX] = useState("");
  const [transformierteY, setTransformierteY] = useState("");
  const [fehler, setFehler] = useState("");

  const handleDienstWechseln = (event) => {
    setDienst(event.target.value);
    setTransformierteX("");
    setTransformierteY("");
    setFehler("");
  };

  async function fetchKoordinaten() {
    setFehler("");
    setTransformierteX("");
    setTransformierteY("");

    if (!ostwert || !nordwert) {
      setFehler("Ostwert und Nordwert sind erforderlich.");
      return;
    }

    const response = await fetch(
      `${URL}/${dienst}?easting=${ostwert}&northing=${nordwert}&format=json`
    );
    const data = await response.json();

    setTransformierteX(data.lng || data.easting);
    setTransformierteY(data.lat || data.northing);
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <Typography variant="h4" gutterBottom>
        Koordinaten Transformation
      </Typography>

      <InputLabel id="dienst-label">REFRAME Dienst</InputLabel>
      <Select
        labelId="dienst-label"
        value={dienst}
        onChange={handleDienstWechseln}
        fullWidth
        margin="normal"
      >
        <MenuItem value="lv95towgs84">LV95 zu WGS84</MenuItem>
        <MenuItem value="wgs84tolv95">WGS84 zu LV95</MenuItem>
      </Select>

      <TextField
        label="Ostwert"
        type="number"
        value={ostwert}
        onChange={(e) => setOstwert(e.target.value)}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Nordwert"
        type="number"
        value={nordwert}
        onChange={(e) => setNordwert(e.target.value)}
        fullWidth
        margin="normal"
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={fetchKoordinaten}
        style={{ marginTop: "20px" }}
      >
        Transformieren
      </Button>

      {fehler && (
        <Alert severity="error" style={{ marginTop: "20px" }}>
          {fehler}
        </Alert>
      )}

      {transformierteX && transformierteY && (
        <div style={{ marginTop: "20px" }}>
          <TextField
            label="Transformierte X"
            value={transformierteX}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
          <TextField
            label="Transformierte Y"
            value={transformierteY}
            fullWidth
            margin="normal"
            InputProps={{ readOnly: true }}
          />
        </div>
      )}
    </div>
  );
}

export default KoordinatenTransformieren;
