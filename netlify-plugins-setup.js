// This is a pre-build plugin for Netlify to fix the Rollup issue
module.exports = {
    onPreBuild: async ({ utils }) => {
      console.log('🔧 Running setup to fix Rollup dependencies...');
      try {
        // Try to install the specific rollup package that's missing
        await utils.run.command('npm i @rollup/rollup-linux-x64-gnu --no-save');
        console.log('✅ Successfully installed @rollup/rollup-linux-x64-gnu');
      } catch (error) {
        console.log('⚠️ Could not install @rollup/rollup-linux-x64-gnu, trying musl version...');
        try {
          await utils.run.command('npm i @rollup/rollup-linux-x64-musl --no-save');
          console.log('✅ Successfully installed @rollup/rollup-linux-x64-musl');
        } catch (muslError) {
          console.log('⚠️ Failed to install Rollup binary packages, but continuing build...');
        }
      }
    }
  };