export default {
  preset: '@vue/cli-plugin-unit-jest',

  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',

    '^.+\\.js$': 'babel-jest'
  },

  moduleFileExtensions: ['js', 'json', 'vue'],

  testMatch: ['**/tests/**/*.spec.js']
}
