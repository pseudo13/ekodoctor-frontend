import axios from "axios";
// import { token } from "../App";

const path = "https://ekodoctor.baotran.de/api";
const API_URL = `${path}/sickcases`;

export function getSickcases() {
  return axios.get(`${API_URL}`);
}

export function getResource(srcUrl) {
  return axios.get(srcUrl);
}

export function updateSickcase(formData, sickcaseId) {
  return axios({
    method: "put",
    url: `${API_URL}/${sickcaseId}`,
    data: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  });
}

export function createSickcase(formData) {
  return axios({
    method: "post",
    url: `${API_URL}`,
    data: formData,
    config: { headers: { "Content-Type": "multipart/form-data" } },
  });
}
