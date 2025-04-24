// NOTE: Navigation colors are hard coded in the CMS
// ks blue has 7.53
const style = document.createElement('style')
style.textContent = /* css */`
    body {
        --color-ks-pink: rgb(141 53 104); /* --mdx-base-color-klubschule-mulberry-600 From 4.01 to 7.38 */
        --color-ks-red: rgb(180 0 20); /* --mdx-base-color-klubschule-red-600 From 4.31 to 7.11 */
        --color-ks-orange: rgb(144 65 31); /* --mdx-base-color-klubschule-orange-600 From 3.43 to 7.09 */
        --color-ks-green: rgb(0 100 83); /* --mdx-base-color-klubschule-green-600 From 3.58 to 7.09 */
    }
`
document.body.appendChild(style)
