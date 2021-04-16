import {ConnectionOptions} from 'typeorm';

import defaultConnection from './defaultConnection';

export default (): ConnectionOptions[] => [defaultConnection()];
