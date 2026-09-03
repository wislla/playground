# Tempo de Brincar

Aplicação em TypeScript para controlar o tempo de permanência de crianças em brinquedos. Os dados ficam salvos localmente no navegador.

## Desenvolvimento

```bash
npm install
npm run dev
```

Para validar o projeto:

```bash
npm test
npm run typecheck
npm run build
```

## Organização

- `web`: front-end Vue/Vite, escrito em TypeScript;
- `web/src/components`: componentes visuais reutilizáveis;
- `web/src/composables`: estado, regras dos temporizadores e persistência;
- `web/src/utils`: formatação, cálculos puros e seus testes unitários;
- `api`: espaço reservado para a futura aplicação de back-end.
