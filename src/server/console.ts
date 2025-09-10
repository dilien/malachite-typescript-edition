import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const askQuestion = (question:string) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

export async function loop(){
    const result = await askQuestion("enter command: save/list/ban/ban_ip/unban:");
    
    loop();
}