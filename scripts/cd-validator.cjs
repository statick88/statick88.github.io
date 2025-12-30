#!/usr/bin/env node

/**
 * CD Pipeline Validator
 * Valida que el pipeline de CD esté correctamente configurado
 * y que todos los componentes estén funcionando
 */

const { execSync } = require('child_process');
const fs = require('fs');

class CDPipelineValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.success = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = {
      'error': '🔴',
      'warn': '🟡', 
      'success': '🟢',
      'info': '🔵',
      'check': '✅'
    }[type] || '🔵';

    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  checkCommand(command, description) {
    try {
      execSync(command, { stdio: 'pipe' });
      this.log(`✅ ${description}`, 'success');
      this.success.push(description);
      return true;
    } catch (error) {
      this.log(`❌ ${description}: ${error.message}`, 'error');
      this.errors.push(`${description}: ${error.message}`);
      return false;
    }
  }

  checkFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.log(`✅ ${description}`, 'success');
      this.success.push(description);
      return true;
    } else {
      this.log(`❌ ${description}: File not found`, 'error');
      this.errors.push(`${description}: File not found`);
      return false;
    }
  }

  checkWorkflowFile(filePath) {
    if (!fs.existsSync(filePath)) {
      this.log(`❌ Workflow file not found: ${filePath}`, 'error');
      this.errors.push(`Missing workflow: ${filePath}`);
      return false;
    }

    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Validaciones básicas del YAML
      const checks = [
        { pattern: /name:/, description: 'Workflow has name' },
        { pattern: /on:/, description: 'Workflow has triggers' },
        { pattern: /jobs:/, description: 'Workflow has jobs' },
        { pattern: /permissions:/, description: 'Workflow has permissions' },
        { pattern: /checkout@v4/, description: 'Uses checkout action v4' },
        { pattern: /deploy-pages/, description: 'Uses deploy-pages action' }
      ];

      checks.forEach(({ pattern, description }) => {
        if (pattern.test(content)) {
          this.log(`✅ ${description}`, 'success');
          this.success.push(description);
        } else {
          this.log(`⚠️ ${description}`, 'warn');
          this.warnings.push(description);
        }
      });

      return true;
    } catch (error) {
      this.log(`❌ Error reading workflow file: ${error.message}`, 'error');
      this.errors.push(`Workflow read error: ${error.message}`);
      return false;
    }
  }

  async validateEnvironment() {
    this.log('🔍 Starting CD Pipeline Validation', 'info');

    // Validar archivos de configuración
    this.log('\n📁 Checking configuration files...', 'info');
    this.checkFileExists('.github/workflows/continuous-deployment.yml', 'CD workflow exists');
    this.checkFileExists('.github/workflows/devsecops.yml', 'DevSecOps workflow exists');
    this.checkFileExists('package.json', 'Package configuration exists');
    this.checkFileExists('astro.config.mjs', 'Astro configuration exists');

    // Validar archivos del workflow
    this.log('\n🔄 Validating workflow configurations...', 'info');
    this.checkWorkflowFile('.github/workflows/continuous-deployment.yml');
    this.checkWorkflowFile('.github/workflows/devsecops.yml');

    // Validar dependencias
    this.log('\n📦 Validating dependencies...', 'info');
    this.checkCommand('npm list --depth=0', 'Dependencies installed');

    // Validar scripts del package.json
    this.log('\n📜 Validating npm scripts...', 'info');
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
      const scripts = packageJson.scripts || {};
      
      const requiredScripts = [
        'dev',
        'build', 
        'test:run',
        'security:scan',
        'validate'
      ];

      requiredScripts.forEach(script => {
        if (scripts[script]) {
          this.log(`✅ Script found: ${script}`, 'success');
          this.success.push(`Script: ${script}`);
        } else {
          this.log(`❌ Missing script: ${script}`, 'error');
          this.errors.push(`Missing script: ${script}`);
        }
      });
    } catch (error) {
      this.log(`❌ Error reading package.json: ${error.message}`, 'error');
      this.errors.push(`Package.json error: ${error.message}`);
    }

    // Validar estructura del proyecto
    this.log('\n🏗️ Validating project structure...', 'info');
    const structureChecks = [
      { path: 'src/services', desc: 'Services directory' },
      { path: 'src/repositories', desc: 'Repositories directory' },
      { path: 'src/tests', desc: 'Tests directory' },
      { path: 'src/factories', desc: 'Factories directory' },
      { path: 'scripts/security-scanner.js', desc: 'Security scanner script' }
    ];

    structureChecks.forEach(({ path: dirPath, desc }) => {
      this.checkFileExists(dirPath, desc);
    });

    // Validar build
    this.log('\n🏗️ Testing build process...', 'info');
    this.checkCommand('npm run build', 'Build process');

    // Validar tests
    this.log('\n🧪 Testing test suite...', 'info');
    this.checkCommand('npm run test:run', 'Test execution');

    // Validar seguridad
    this.log('\n🔒 Running security validation...', 'info');
    this.checkCommand('npm run security:audit', 'Security audit');

    // Validar calidad de código
    this.log('\n📋 Running code quality validation...', 'info');
    this.checkCommand('npm run validate', 'Code quality validation');
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 CD PIPELINE VALIDATION REPORT');
    console.log('='.repeat(80));
    
    console.log(`\n🟢 Successful Checks: ${this.success.length}`);
    this.success.forEach(item => console.log(`   ✅ ${item}`));
    
    if (this.warnings.length > 0) {
      console.log(`\n🟡 Warnings: ${this.warnings.length}`);
      this.warnings.forEach(item => console.log(`   ⚠️ ${item}`));
    }
    
    if (this.errors.length > 0) {
      console.log(`\n🔴 Errors: ${this.errors.length}`);
      this.errors.forEach(item => console.log(`   ❌ ${item}`));
    }
    
    console.log('\n' + '='.repeat(80));
    
    // Veredicto
    if (this.errors.length === 0) {
      console.log('🎉 CD Pipeline is READY for deployment!');
      console.log('✅ All validations passed');
      console.log('🚀 You can safely deploy to production');
    } else {
      console.log('⚠️ CD Pipeline needs attention before deployment');
      console.log(`❌ Fix ${this.errors.length} error(s) before deploying`);
      console.log('🔧 Review the issues above and run validation again');
    }
    
    console.log('='.repeat(80));
    
    return {
      success: this.errors.length === 0,
      totalChecks: this.success.length + this.warnings.length + this.errors.length,
      passed: this.success.length,
      warnings: this.warnings.length,
      errors: this.errors.length
    };
  }

  async run() {
    await this.validateEnvironment();
    return this.generateReport();
  }
}

// Ejecutar validación
if (require.main === module) {
  const validator = new CDPipelineValidator();
  validator.run().then(result => {
    process.exit(result.success ? 0 : 1);
  });
}

module.exports = CDPipelineValidator;