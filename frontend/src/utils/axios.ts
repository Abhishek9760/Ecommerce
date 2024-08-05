import axios from "axios";
import { baseUrl } from "../constants";

export const apiInstance = axios.create({
  baseURL: baseUrl,
  timeout: 10000,
});
