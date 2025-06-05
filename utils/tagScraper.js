const fs = require('fs')
const path = require('path')

// Function to extract tags from frontmatter in MDX files
function extractTagsFromFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8')
  const frontmatterMatch = content.match(/---\s+([\s\S]*?)\s+---/)

  if (frontmatterMatch) {
    const frontmatter = frontmatterMatch[1]
    const tagsMatch = frontmatter.match(/tags:\s*\[(.*?)\]/)

    if (tagsMatch) {
      // Extract tags from the tags array
      const tagsString = tagsMatch[1]
      return tagsString
        .split(',')
        .map((tag) => tag.trim().replace(/['"`]/g, '')) // Remove quotes
        .filter((tag) => tag) // Filter out empty tags
    }
  }

  return []
}

// Main function to process all blog files
function analyzeTagFrequency(blogDir) {
  const tagFrequency = {}

  // Read all files in the blog directory
  const files = fs.readdirSync(blogDir)

  files.forEach((file) => {
    // Only process MDX files
    if (path.extname(file) === '.mdx') {
      const filePath = path.join(blogDir, file)
      const tags = extractTagsFromFile(filePath)

      // Increment tag frequency
      tags.forEach((tag) => {
        tagFrequency[tag] = (tagFrequency[tag] || 0) + 1
      })
    }
  })

  // Sort tags by frequency (descending)
  const sortedTags = Object.entries(tagFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([tag, count]) => ({ tag, count }))

  return sortedTags
}

// Set the path to your blog directory
const blogDirectory = './data/blog'

// Run the analysis
const tagStats = analyzeTagFrequency(blogDirectory)

// Print the results
console.log('Tag Frequency Analysis:')
console.log('======================')
tagStats.forEach(({ tag, count }) => {
  console.log(`${tag}: ${count}`)
})

// Print some summary statistics
console.log('\nSummary:')
console.log(`Total unique tags: ${tagStats.length}`)
console.log(`Most used tag: ${tagStats[0].tag} (${tagStats[0].count} occurrences)`)
