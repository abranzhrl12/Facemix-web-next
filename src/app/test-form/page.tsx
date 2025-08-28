"use client";

import React, { useState } from 'react';
import styles from './page.module.scss';

export default function TestFormPage() {
  const [testInput, setTestInput] = useState('');
  const [testNumber, setTestNumber] = useState(0.8);
  const [personId, setPersonId] = useState('');

  console.log('🔍 TestFormPage - Estado:', { testInput, testNumber, personId });

  return (
    <div className={styles.container}>
      <h1>🧪 Página de Prueba de Formulario</h1>
      
      <div className={styles.form}>
        <h2>Formulario de Prueba</h2>
        
        <div className={styles.formGroup}>
          <label htmlFor="testInput">Input de Texto:</label>
          <input
            type="text"
            id="testInput"
            value={testInput}
            onChange={(e) => {
              console.log('🔍 onChange testInput:', e.target.value);
              setTestInput(e.target.value);
            }}
            placeholder="Escribe algo aquí..."
            className={styles.input}
          />
          <p>Valor actual: <strong>{testInput}</strong></p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="testNumber">Input Numérico:</label>
          <input
            type="number"
            id="testNumber"
            value={testNumber}
            onChange={(e) => {
              console.log('🔍 onChange testNumber:', e.target.value);
              setTestNumber(parseFloat(e.target.value) || 0);
            }}
            min="0"
            max="1"
            step="0.1"
            className={styles.input}
          />
          <p>Valor actual: <strong>{testNumber}</strong></p>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="personId">ID de Persona (UUID):</label>
          <input
            type="text"
            id="personId"
            value={personId}
            onChange={(e) => {
              console.log('🔍 onChange personId:', e.target.value);
              setPersonId(e.target.value);
            }}
            placeholder="123e4567-e89b-12d3-a456-426614174000"
            className={styles.input}
          />
          <p>Valor actual: <strong>{personId}</strong></p>
        </div>

        {/* Simulación del formulario principal */}
        <div className={styles.formGroup}>
          <label htmlFor="simulatedPersonId">ID de Persona (Simulado):</label>
          <input
            type="text"
            id="simulatedPersonId"
            value={personId}
            onChange={(e) => {
              console.log('🔍 onChange simulatedPersonId:', e.target.value);
              setPersonId(e.target.value);
            }}
            placeholder="123e4567-e89b-12d3-a456-426614174000"
            className={styles.input}
            style={{
              padding: '12px 16px',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem',
              background: 'white',
              color: '#2d3748',
              width: '100%',
              minHeight: '44px'
            }}
          />
          <p>Valor actual: <strong>{personId}</strong></p>
        </div>

        <div className={styles.buttons}>
          <button
            onClick={() => {
              console.log('🔍 Botón limpiar clickeado');
              setTestInput('');
              setTestNumber(0.8);
              setPersonId('');
            }}
            className={styles.button}
          >
            Limpiar Formulario
          </button>
          
          <button
            onClick={() => {
              console.log('🔍 Botón test clickeado');
              alert(`Input: "${testInput}", Number: ${testNumber}, PersonId: "${personId}"`);
            }}
            className={styles.button}
          >
            Test Valores
          </button>

          <button
            onClick={() => {
              console.log('🔍 Botón setear valores clickeado');
              setTestInput('Texto de prueba');
              setTestNumber(0.5);
              setPersonId('123e4567-e89b-12d3-a456-426614174000');
            }}
            className={styles.button}
          >
            Setear Valores de Prueba
          </button>
        </div>
      </div>

      <div className={styles.info}>
        <h3>Información de Debug</h3>
        <p>Esta página es para probar si los inputs funcionan correctamente.</p>
        <p>Si puedes escribir aquí, el problema está en el formulario principal.</p>
        <p>Si NO puedes escribir aquí, hay un problema más profundo.</p>
        <p><strong>Estado actual:</strong></p>
        <ul>
          <li>testInput: "{testInput}"</li>
          <li>testNumber: {testNumber}</li>
          <li>personId: "{personId}"</li>
        </ul>
      </div>
    </div>
  );
}
