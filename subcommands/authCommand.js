import { Command } from "commander";
import { startAuthorizationProcess, startSignOutProcess } from "../auth/index.js";

const program = new Command("auth");

program
    .description("Command for singup and sigout from mygogo");

const signup = program.command("signup");

signup
    .description("Signup into the application by providing the consent")
    .action(async () => {
        try {
            await startAuthorizationProcess();
        } catch(error) {
            console.log(error);
            console.log("Unable to signup");
        }
    })


const signout = program.command("signout");

signout
    .description("Signout from the application")
    .action(async () => {
        try {
            await startSignOutProcess();

        } catch (error) {
            
        }
    })



export default program;