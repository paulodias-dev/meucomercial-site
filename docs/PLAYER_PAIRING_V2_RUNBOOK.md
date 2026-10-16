# Portal do estabelecimento — Pareamento seguro e suporte

Na aba **Meus dispositivos**, escolha o Player já provisionado com assinatura ativa, gere o PIN no aplicativo Player Web na TV ou Rádio e informe os seis dígitos no campo “Conectar este Player”. O Site chama somente o gateway allowlist `claim-device`: `device_id` decimal positivo verificado, `pin` de seis dígitos, JWT de cliente em memória e nenhum token do aparelho recebido. O backend valida escopo e assinatura.

A operação muda o cadastro existente para “autorizado, aguardando resgate do Player”. Não cria nova tela nem substitui token já pareado. A ação antiga “Gerar PIN”, para clientes que usam um Player legado, continua identificada separadamente.

**Ver histórico e diagnóstico** abre, no próprio cartão, o estado da versão atual de manifesto, heartbeat, data de último sync, até 12 confirmações e 8 comandos, sem divulgar tokens, IP, payload interno ou mensagens administrativas. A tela de destinos da publicação passa a exibir `sync_acknowledged` somente quando o servidor encontra um ACK autenticado V2 com manifesto suficiente e playlist compatível. **Não confundir confirmação de sincronização com prova de reprodução.**

### Aceite pendente
Verificar autenticação expirando, falhas 409/422/429, troca de tenant, mobile 320px, acessibilidade, servidor HTTPS, códigos inválidos/expirados, QR ainda pendente e uso em aparelho físico. Build React/Express real e E2E não executados nesta sessão; testes estáticos de contrato exercitados.
