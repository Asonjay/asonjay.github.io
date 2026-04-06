import fs from 'fs'
import path from 'path'
import { Publication } from '../types/publication'

export async function getAllPublications(): Promise<Publication[]> {
  const bibPath = path.join(
    process.cwd(),
    'content/publications/bibliography.bib'
  )
  const bibContent = await fs.promises.readFile(bibPath, 'utf8')

  return parseBibTeX(bibContent)
}

const CUSTOM_FIELDS = new Set([
  'selected', 'abbr', 'bibtex_show', 'field', 'thumbnail', 'pdf', 'code',
])

function buildRawBibtex(type: string, citationKey: string, fields: string): string {
  const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g
  const cleanFields: string[] = []
  let m
  while ((m = fieldRegex.exec(fields)) !== null) {
    if (!CUSTOM_FIELDS.has(m[1].toLowerCase())) {
      cleanFields.push(`  ${m[1]} = {${m[2]}}`)
    }
  }
  return `@${type}{${citationKey},\n${cleanFields.join(',\n')}\n}`
}

function parseBibTeX(content: string): Publication[] {
  const entries: Publication[] = []
  const entryRegex = /@(\w+)\s*\{([^,]*),([^@]*)\}/g
  const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}/g

  let match
  while ((match = entryRegex.exec(content)) !== null) {
    const [_, type, citationKey, fields] = match

    if (
      type.toLowerCase() === 'article' ||
      type.toLowerCase() === 'inproceedings' ||
      type.toLowerCase() === 'inbook' ||
      type.toLowerCase() === 'incollection' ||
      type.toLowerCase() === 'phdthesis' ||
      type.toLowerCase() === 'misc'
    ) {
      const publication: Partial<Publication> = {}
      let fieldMatch

      while ((fieldMatch = fieldRegex.exec(fields)) !== null) {
        const [__, fieldName, fieldValue] = fieldMatch
        const name = fieldName.toLowerCase()

        switch (name) {
          case 'title':
            publication.title = fieldValue.trim()
            break
          case 'author':
            publication.authors = fieldValue
              .split(' and ')
              .map(author => author.trim())
              .map(author => author.split(',').reverse().join(' ').trim())
            break
          case 'year':
            publication.year = parseInt(fieldValue)
            break
          case 'booktitle':
          case 'journal':
          case 'archivePrefix':
            publication.venue = fieldValue.trim()
            break
          case 'url':
            publication.url = fieldValue.trim()
            break
          case 'pdf':
            publication.pdf = fieldValue.trim()
            break
          case 'code':
            publication.code = fieldValue.trim()
            break
          case 'abstract':
            publication.abstract = fieldValue.trim()
            break
          case 'doi':
            publication.doi = fieldValue.trim()
            break
          case 'abbr':
            publication.abbr = fieldValue.trim()
            break
          case 'selected':
            publication.selected = fieldValue.toLowerCase() === 'true'
            break
          case 'thumbnail':
            publication.thumbnail = fieldValue.trim()
            break
          case 'field':
            publication.field = fieldValue.trim()
            break
        }
      }

      if (publication.title && publication.authors && publication.year) {
        publication.bibtex = buildRawBibtex(type, citationKey, fields)
        entries.push(publication as Publication)
      }
    }
  }

  return entries.sort((a, b) => b.year - a.year)
}
