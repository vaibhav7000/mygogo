#!/Users/vaibhavchawla/.nvm/versions/node/v22.22.2/bin/node
import { Command } from "commander";
import userInfoCommand from "./subcommands/userinfoCommand.js";
import authCommand from "./subcommands/authCommand.js"
const program = new Command("mygogo");

program
    .version('1.0.0')
    .description('Google APIS CLI Wrapper mygogo')

program
    .addCommand(userInfoCommand);

program
    .addCommand(authCommand);

program.parse(process.argv);