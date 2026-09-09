import { spawnSync } from 'node:child_process'
import { existsSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const cssDirectory = join(projectRoot, 'src', 'css')
const tokenDirectory = join(
  cssDirectory,
  'web-components-toolbox-migros-design-experience',
  'node_modules',
  '@migros',
  'mdx-design-tokens',
  'dist',
  'css',
  '03_component',
  'brands'
)
const lightningCss = join(
  projectRoot,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'lightningcss.cmd' : 'lightningcss'
)
const migrosComponentImport = '@import "./web-components-toolbox-migros-design-experience/node_modules/@migros/mdx-design-tokens/dist/css/03_component/brands/migros/light-rem.css";'
const propertyDeclaration = /^\s*(--[A-Za-z0-9_-]+)\s*:/

const builds = [
  { name: 'Klubschule', theme: 'klubschule' },
  { name: 'Ibaw', theme: 'ibaw' },
  { name: 'Ksos', theme: 'pro' }
]

if (!existsSync(lightningCss)) {
  throw new Error('lightningcss is missing. Run npm install before building CSS.')
}

const migrosComponentPath = join(tokenDirectory, 'migros', 'light-rem.css')

if (!existsSync(migrosComponentPath)) {
  throw new Error(`MDX design-token CSS not found at ${migrosComponentPath}. Ensure the MDX submodule/dependencies are available before building CSS.`)
}

const migrosComponentCss = readFileSync(migrosComponentPath, 'utf8')
extractPropertyNames(migrosComponentCss, 'Migros component tokens')
assertRootScopedProperties(migrosComponentCss, 'Migros component tokens')

for (const build of builds) {
  buildBrandCss(build)
}

function buildBrandCss ({ name, theme }) {
  const sourcePath = join(cssDirectory, `variablesCustom${name}.css`)
  const outputPath = join(cssDirectory, `variablesCustom${name}.min.css`)
  const fallbackPath = join(cssDirectory, `.variablesMigrosFallback${name}.build.css`)
  const entryPath = join(cssDirectory, `.variablesCustom${name}.build.css`)
  const brandComponentPath = join(tokenDirectory, theme, 'light-rem.css')

  const sourceCss = readFileSync(sourcePath, 'utf8')
  const brandComponentCss = readFileSync(brandComponentPath, 'utf8')
  const brandProperties = extractPropertyNames(brandComponentCss, `${theme} component tokens`)
  assertRootScopedProperties(brandComponentCss, `${theme} component tokens`)
  assertSingleOccurrence(
    sourceCss,
    `@import "./web-components-toolbox-migros-design-experience/node_modules/@migros/mdx-design-tokens/dist/css/03_component/brands/${theme}/light-rem.css";`
  )
  const { css: fallbackCss, removedCount } = removeOverriddenProperties(
    migrosComponentCss,
    brandProperties
  )
  const entryCss = replaceSingle(
    sourceCss,
    migrosComponentImport,
    `@import "./${basename(fallbackPath)}";`
  )

  try {
    writeFileSync(fallbackPath, fallbackCss)
    writeFileSync(entryPath, entryCss)

    const result = spawnSync(lightningCss, [
      '--minify',
      '--bundle',
      '--targets',
      '>= 0.25%',
      entryPath,
      '-o',
      outputPath
    ], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: 'inherit'
    })

    if (result.error) throw result.error
    if (result.status !== 0) {
      throw new Error(`lightningcss failed while building ${name} with exit code ${result.status}.`)
    }

    console.log(`${name}: removed ${removedCount} overridden Migros declarations; output ${statSync(outputPath).size} bytes.`)
  } finally {
    rmSync(fallbackPath, { force: true })
    rmSync(entryPath, { force: true })
  }
}

function extractPropertyNames (css, sourceName) {
  const names = css
    .split(/\r?\n/)
    .map(line => line.match(propertyDeclaration)?.[1])
    .filter(Boolean)
  const declarationCount = css.match(/--[A-Za-z0-9_-]+\s*:/g)?.length ?? 0

  if (names.length !== declarationCount) {
    throw new Error(`${sourceName} no longer contains exactly one custom-property declaration per line.`)
  }

  return new Set(names)
}

function removeOverriddenProperties (css, overriddenProperties) {
  let removedCount = 0
  const filteredLines = css
    .split(/\r?\n/)
    .filter(line => {
      const propertyName = line.match(propertyDeclaration)?.[1]
      const isOverridden = propertyName !== undefined && overriddenProperties.has(propertyName)

      if (isOverridden) removedCount++
      return !isOverridden
    })

  if (removedCount === 0) {
    throw new Error('The brand theme did not override any Migros component tokens.')
  }

  return { css: filteredLines.join('\n'), removedCount }
}

function assertRootScopedProperties (css, sourceName) {
  const selectors = css
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.endsWith('{') && !line.startsWith('@'))
    .map(line => line.slice(0, -1).trim())
  const unexpectedSelectors = [...new Set(selectors.filter(selector => selector !== ':root'))]

  if (unexpectedSelectors.length > 0) {
    throw new Error(`${sourceName} contains unsupported selectors: ${unexpectedSelectors.join(', ')}.`)
  }
}

function replaceSingle (value, search, replacement) {
  assertSingleOccurrence(value, search)
  return value.replace(search, replacement)
}

function assertSingleOccurrence (value, search) {
  const firstIndex = value.indexOf(search)
  const lastIndex = value.lastIndexOf(search)

  if (firstIndex === -1 || firstIndex !== lastIndex) {
    throw new Error(`Expected exactly one occurrence of "${search}", found it at indexes ${firstIndex} and ${lastIndex}.`)
  }
}
