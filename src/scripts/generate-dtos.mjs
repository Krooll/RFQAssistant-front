import { execSync } from 'child_process';
import readline from 'readline';
import fs from 'fs';
import path from 'path';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function generate() {
  try {
    const username = await question('Podaj login: ');
    const password = await question('Podaj hasło: ');
    rl.close();

    console.log('🔄 Pobieranie schematu OpenAPI z backendu...');

    const credentials = Buffer.from(`${username.trim()}:${password.trim()}`).toString('base64');
    const response = await fetch('http://localhost:5200/v3/api-docs', {
      headers: { Authorization: `Basic ${credentials}` },
    });

    if (!response.ok) {
      throw new Error(`Błąd autoryzacji / pobierania: HTTP ${response.status}`);
    }

    const schemaJson = await response.json();
    const tempFilePath = path.join(process.cwd(), 'swagger-temp.json');
    const baseDtosDir = path.join(process.cwd(), 'src', 'core', 'dtos');

    fs.writeFileSync(tempFilePath, JSON.stringify(schemaJson, null, 2));

    console.log('⚡ Generowanie bazowego pliku api-dtos.ts...');
    execSync(`npx openapi-typescript ./swagger-temp.json -o ./src/core/dtos/api-dtos.ts`, {
      stdio: 'inherit',
    });

    if (fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

    console.log('📂 Tworzenie czystych struktur domenowych i plików DTO...');

    const schemas = schemaJson.components?.schemas || {};
    const schemaNames = Object.keys(schemas);

    const groups = {};

    schemaNames.forEach((name) => {
      // 1. Wyciągamy słowo kluczowe domeny (np. "Supplier", "User", "Auth")
      // Szukamy znanych domen lub czyścimy przedrostki i przyrostki
      let domain = name;

      // Usuwamy powszechne techniczne prefiksy/sufiksy Springa i DTO
      domain = domain
        .replace(
          /^(Page|Slice|Collection|Iterable|Create|Update|Patch|Delete|Request|Response)/g,
          '',
        )
        .replace(/(Dto|Request|Response|Entity|VO)$/g, '');

      domain = domain.toLowerCase().trim();

      // Jeśli po oczyszczeniu nic nie zostało lub nazwa to klasa generyczna Springa (np. ProblemDetail)
      if (!domain || domain === 'pageable' || domain === 'sort') {
        domain = 'common';
      }

      if (!groups[domain]) groups[domain] = [];
      groups[domain].push(name);
    });

    const indexExports = [];

    // Czyszczenie starego katalogu przed ponownym wygenerowaniem (żeby usunąć śmieciowe foldery)
    Object.entries(groups).forEach(([domain, typeNames]) => {
      const domainDir = path.join(baseDtosDir, domain);
      if (!fs.existsSync(domainDir)) {
        fs.mkdirSync(domainDir, { recursive: true });
      }

      const filePath = path.join(domainDir, `${domain}.dto.ts`);
      let content = `import { components } from '../api-dtos';\n\n`;

      typeNames.forEach((typeName) => {
        content += `export type ${typeName} = components['schemas']['${typeName}'];\n`;
      });

      fs.writeFileSync(filePath, content);
      console.log(
        `  └─ Utworzono: src/core/dtos/${domain}/${domain}.dto.ts (${typeNames.join(', ')})`,
      );

      indexExports.push(`export * from './${domain}/${domain}.dto';`);
    });

    const indexPath = path.join(baseDtosDir, 'index.ts');
    fs.writeFileSync(indexPath, indexExports.join('\n') + '\n');
    console.log(`  └─ Utworzono zbiorczy plik: src/core/dtos/index.ts`);

    console.log('\n🎉 Proces zakończony sukcesem!');
  } catch (error) {
    console.error('\n❌ Błąd:', error.message);
    process.exit(1);
  }
}

generate();
