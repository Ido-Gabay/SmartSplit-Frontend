import 'react-native-gesture-handler';
import 'core-js/stable';
import App from './App';

import { decode } from "base-64";
global.atob = decode;