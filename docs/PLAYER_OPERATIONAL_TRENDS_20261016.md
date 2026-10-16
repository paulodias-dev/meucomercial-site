# Tendência visual de TV/Rádio por Player — 16/10/2026

O cliente autenticado abre Diagnóstico > Histórico detalhado sob demanda.
Ao escolher 1, 7 ou 30 dias e all/tv/radio, a mesma resposta paginada
da API #84 inclui summary.by_day (calendário UTC) de todos os relatos no
intervalo e no mesmo dispositivo. O gráfico de barras representa os três
tipos e preserva zero. CSV mantém escopo estrito de 20 itens visíveis.

Checklist QA: confirmar tabela de cores, foco/acessibilidade com leitor de
tela, rolagem mobile, separação entre legenda e registros, página 2,
troca de token/Player, 401/404/422 e cancelamento AbortController.
Lacunas não atestam offline; relatos do aparelho não são audiência nem
comprovação independente de publicidade. Não implantar antes da API #84.
