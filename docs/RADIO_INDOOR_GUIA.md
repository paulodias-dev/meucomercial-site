# Rádio Indoor — Guia comercial, licenças e operação

> Documento público orientativo da plataforma Meu Comercial. Atualização: 15/10/2026. Não substitui contratos, autorização de titulares de direitos ou homologação técnica.

## Para o estabelecimento que deseja Rádio Indoor

A Rádio Indoor organiza a trilha sonora e os comunicados de um estabelecimento por local/unidade e por dispositivo autorizado. O cliente informa o contexto comercial e escolhe a programação de repertório licenciado, vinhetas e mensagens institucionais, respeitando o plano de assinatura, os direitos dos arquivos e o local contratado.

**Fluxo sugerido:** contato comercial → verificação da estrutura de áudio e internet → orçamento separado de software/hardware/licenciamento → assinatura e cadastro do estabelecimento → cadastro dos locais → pareamento do Player → organização da playlist → revisão de direitos → ativação da grade → acompanhamento de conectividade e sincronização.

### Música, licenciamento e documentação

1. A aquisição/assinatura do software **não** equivale à aquisição automática de direitos autorais para execução pública. O responsável pelo estabelecimento deve verificar quais autorizações são exigidas para o repertório, uso e local, inclusive obrigações perante os titulares e entidades aplicáveis.
2. Os arquivos devem ter licença, origem e titularidade documentadas no cadastro quando necessário. Músicas e spots publicitários têm regimes comerciais e permissões distintos; não reutilizar o arquivo de outra agência sem autorização.
3. Uma licença vencida ou um contrato revogado bloqueia a execução comercial. Nenhum arquivo de publicidade privada deve ser publicado com URL permanente e pública.
4. Não prometer rádio totalmente offline, biblioteca ilimitada licenciada ou fornecimento de músicas de terceiros sem o contrato correspondente.

## Para anunciantes e agências

O anunciante compra **espaço publicitário**, não a assinatura do estabelecimento. A venda pode depender de reserva de inventário, vigência, autorização bilateral entre agências, direitos do spot, revisão de criativo, limites de inserção e elegibilidade dos Players no ponto contratado.

- Campanha aprovada → reserva confirmada → revisão de criativo/licença → seleção de destinos → ativação.
- Inserções são distribuídas pelo backend respeitando a quantidade contratada **por ordem**, repartida entre os dispositivos selecionados.
- Player executa spot entre faixas próprias; não interrompe áudio editorial em reprodução.
- Após conclusão, evento autenticado/idempotente pode ser enviado imediatamente ou por outbox em lote (até 48h de janela de reenvio); downloads e heartbeats **não contam** como reprodução.
- O painel mostra quantidade contratada versus eventos **informados pelo Player**. Isso não comprova ouvintes, atenção, alcance, retorno financeiro, venda realizada nem audiência independentemente auditada.
- Cancelamentos ou revogação de direitos retiram a campanha. Se um dispositivo esteve offline, a cota não cumprida precisa de nova decisão de reprogramação; ela não é automaticamente considerada entregue.

## Perguntas frequentes

**Posso transmitir uma playlist do meu celular?** Não há promessa de importação universal de serviços de streaming. Somente fontes e arquivos autorizados e compatíveis com o Player devem ser programados.

**Rádio precisa de internet?** O Player Web revalida periodicamente a autorização. A fila de comprovantes pode ser persistida offline, mas a reprodução ininterrupta permanente sem acesso à API não é garantida.

**Posso ter várias lojas?** O modelo permite localidades diferentes, desde que clientes, dispositivos, assinaturas, permissões e grades estejam corretamente vinculados.

**Posso vender anúncios de terceiros?** Sim, quando há inventário e contrato de publicidade autorizado, criativo aprovado e direitos de mídia válidos. A venda do anúncio não equivale à assinatura do estabelecimento.

**Como saber quantas vezes um spot tocou?** Consulte o relatório de eventos concluídos e informados por Player, conciliados com a quantidade contratada. Não use número de downloads como métrica de veiculação.

**Quais aparelhos são compatíveis?** Depende dos formatos de áudio e navegador/hardware. É necessária homologação de codec, autoplay, saída de som e operação contínua no aparelho real.

## Exemplos didáticos (sem transmissão de áudio)

1. Vinheta de abertura institucional previamente aprovada.
2. Faixa de repertório com autorização de uso e contrato vigente.
3. Entre faixas, spot comercial apenas se houver reserva ativa, licença válida, Player elegível e cota disponível.
4. Faixa seguinte; conclusão comercial declarada somente quando terminar a reprodução do spot.

A seção `#radio-indoor` da home exibe esta sequência ilustrativa de forma textual. **Não é rádio ao vivo, não reproduz fonogramas de terceiros e não implica mídia real carregada**.

## Próximos passos de produto (não afirmar concluídos)

- Demonstração sonora com biblioteca/licença de arquivos próprios aprovados.
- Homologação E2E do Player de Rádio, alternância com música e contratos em hardware real.
- Precificação dinâmica autorizada por catálogo e onboarding pago, sem inventar valores.
- Revisão jurídica das licenças e obrigações específicas por uso e estabelecimento.

**Atendimento:** o CTA “Conversar sobre Rádio Indoor” abre o formulário de lead existente, com consentimento LGPD. O site não realiza contrato, cobrança ou ativação a partir dessa simulação.
