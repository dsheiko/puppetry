// https://isomorphic-git.org/docs/en/
const path = require( "path" );
const git = require("isomorphic-git");
const fs = require("fs");
git.plugins.set( "fs", fs );

const REMOTE = "gitlab",
      DIR = path.join( __dirname, "test" ),
      GIT_REPO = process.env.GIT_REPO,
      USER_NAME = process.env.USER_NAME,
      USER_EMAIL = process.env.USER_EMAIL,
      AUTH_USERNAME = process.env.AUTH_USERNAME,
      AUTH_PASSWORD = process.env.AUTH_PASSWORD;

async function initGit() {
  await git.clone({
    dir: DIR,
    url: GIT_REPO,
    singleBranch: true,
    depth: 1,
    remote: REMOTE,
    username: AUTH_USERNAME,
    password: AUTH_PASSWORD
  });
}

async function testGit() {
  try {
     console.log( "Go..." );
     //await initGit();
//     await git.init({ dir: DIR });
//     await git.addRemote({ dir: DIR, remote: REMOTE, url: GIT_REPO });

    await git.add({ dir: DIR, filepath: ".puppetryrc" });
    await git.add({ dir: DIR, filepath: "careeer--apply.json" });

    console.log( "commit" );
    let sha = await git.commit({
      dir: DIR,
      message: "Checking with isomorph",
      author: {
        name: USER_NAME,
        email: USER_EMAIL
      }
    });
    console.log( `commit: ${ sha }` );
    console.log( "push" );
    let pushResponse = await git.push({
        dir: DIR,
        remote: REMOTE,
        ref: "master",
        force: true,
        //token: process.env.GITHUB_TOKEN,
        username: AUTH_USERNAME,
        password: AUTH_PASSWORD
      });
    console.log( "DONE", pushResponse );
  } catch ( e ) {
    console.error( e );
  }

}

testGit();