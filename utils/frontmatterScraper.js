const fs = require('fs')
const path = require('path')

// Function to extract frontmatter from MDX content
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/
  const match = content.match(frontmatterRegex)

  if (!match || !match[1]) {
    return {}
  }

  const frontmatterLines = match[1].split('\n')
  const frontmatter = {}

  frontmatterLines.forEach((line) => {
    // Skip empty lines
    if (!line.trim()) return

    // Handle arrays and objects specially
    if (line.trim().startsWith('- ') || line.trim().startsWith('# ')) {
      // Skip these lines as they're part of a list or comment
      return
    }

    // Parse the key-value pair (assuming format: key: value)
    const colonIndex = line.indexOf(':')
    if (colonIndex !== -1) {
      const key = line.slice(0, colonIndex).trim()
      // Skip if key contains invalid characters for property names
      if (key.includes(' ') || key.includes('-') || key.includes("'") || key.includes('https'))
        return

      const value = line.slice(colonIndex + 1).trim()
      frontmatter[key] = value
    }
  })

  return frontmatter
}

// Main function to process blog directory
function processBlogDirectory(directoryPath) {
  const propertyCounts = {}
  let totalFiles = 0

  try {
    // Get all files in the directory
    const files = fs.readdirSync(directoryPath)

    // Filter for MDX files
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'))
    totalFiles = mdxFiles.length

    console.log(`Found ${totalFiles} MDX files`)

    // Process each MDX file
    mdxFiles.forEach((file) => {
      const filePath = path.join(directoryPath, file)
      const content = fs.readFileSync(filePath, 'utf8')

      // Extract frontmatter
      const frontmatter = extractFrontmatter(content)

      // Count occurrences of each property
      Object.keys(frontmatter).forEach((key) => {
        propertyCounts[key] = (propertyCounts[key] || 0) + 1
      })
    })

    // Calculate required vs optional properties
    // Properties present in more than 90% of files are considered required
    const requiredThreshold = totalFiles * 0.9
    const requiredProps = []
    const optionalProps = []

    Object.keys(propertyCounts).forEach((prop) => {
      const count = propertyCounts[prop]
      const percentage = ((count / totalFiles) * 100).toFixed(2)

      if (count >= requiredThreshold) {
        requiredProps.push(prop)
      } else {
        optionalProps.push(prop)
      }

      console.log(`${prop}: ${count}/${totalFiles} (${percentage}%)`)
    })

    // Generate TypeScript type definition
    generateTypeDefinition(requiredProps, optionalProps)

    return {
      requiredProps,
      optionalProps,
      propertyCounts,
      totalFiles,
    }
  } catch (error) {
    console.error('Error processing blog directory:', error)
    return {
      requiredProps: [],
      optionalProps: [],
      propertyCounts: {},
      totalFiles: 0,
    }
  }
}

// Function to generate TypeScript type definition
function generateTypeDefinition(requiredProps, optionalProps) {
  let typeDefinition = 'type BlogFrontmatter = {\n'

  // Required properties
  requiredProps.forEach((prop) => {
    typeDefinition += `  ${prop}: string;\n`
  })

  // Optional properties
  optionalProps.forEach((prop) => {
    typeDefinition += `  ${prop}?: string;\n`
  })

  typeDefinition += '};\n'

  console.log('\nTypeScript Type Definition:')
  console.log(typeDefinition)

  // Optionally write to a file
  // fs.writeFileSync('BlogFrontmatter.ts', typeDefinition);
}

// Path to your blog directory
const blogDirectory = './data/blog' // Adjust this to your actual path

// Execute the script
processBlogDirectory(blogDirectory)
