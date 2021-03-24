const { console, session } = scriptContext;

async function main() {
  const identity = session.getIdentity();
  const userName = identity.getName();

  console.info(`Hello ${userName}`);

  console.info(`<Plus4U5.Bricks.BusinessCard uuIdentity="${identity.getUuIdentity()}" visual="mini"/>`);

  return {
    message: "Hello",
    user: userName,
    uuAppErrorMap: {}
  };
}

main();
