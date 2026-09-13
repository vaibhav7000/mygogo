import { Command } from "commander";
import { getUserInfo } from "../googleapis/userinfo/index.js";
const program = new Command();

program
    .name("userinfo")
    .description("Play with the user information")


const getInfoProgram = program.command("get");

getInfoProgram
    .description("Get the user information from GOOGLE")
    .action(async () => {
        try {
            const data = await getUserInfo();
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    })

export default program;