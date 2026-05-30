/**
 * Config plugin que corrige o erro de build iOS:
 *   "include of non-modular header inside framework module ... -Wnon-modular-include-in-framework-module"
 * causado por @react-native-firebase + use_frameworks! :linkage => :static.
 *
 * Injeta CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES = YES em todos os
 * targets dos Pods, dentro do post_install do Podfile gerado no prebuild.
 */
const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const MARKER = 'CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES';

const INJECT = `
    installer.pods_project.targets.each do |target|
      target.build_configurations.each do |bc|
        bc.build_settings['${MARKER}'] = 'YES'
      end
    end
`;

module.exports = function withNonModularHeaders(config) {
  return withDangerousMod(config, [
    'ios',
    (cfg) => {
      const podfilePath = path.join(cfg.modRequest.platformProjectRoot, 'Podfile');
      let contents = fs.readFileSync(podfilePath, 'utf-8');

      if (!contents.includes(MARKER) && contents.includes('post_install do |installer|')) {
        contents = contents.replace(
          'post_install do |installer|',
          `post_install do |installer|\n${INJECT}`,
        );
        fs.writeFileSync(podfilePath, contents);
      }

      return cfg;
    },
  ]);
};
