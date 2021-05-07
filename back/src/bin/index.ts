#!/usr/bin/env node
import {CliCore} from "@tsed/cli-core";
import {FakerCommand} from "../commands/FakerCommand";
import typeormConfig from "../config/typeorm";
import '@tsed/typeorm';
import * as dotenv from "dotenv";
dotenv.config();
CliCore.bootstrap({
    typeorm: typeormConfig(),
    commands: [
        FakerCommand
    ]
}).catch(console.error);