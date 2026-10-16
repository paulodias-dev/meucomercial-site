# Portal — QR de pareamento e auditabilidade de Rádio

A TV/Rádio mostra um PIN V2 e, após configurar o domínio HTTPS oficial do Portal, um QR **gerado localmente**, contendo apenas o endereço do portal e o PIN no fragmento `#pair=...`.

Ao abrir `/portal#pair=123456`, a interface:
1. Valida estritamente seis dígitos; ignora outros fragments.
2. Apaga imediatamente o fragmento do endereço via `history.replaceState`, antes de qualquer login, requisição ou navegação.
3. Guarda o PIN **somente em estado temporário de memória**; o usuário autentica-se com seu próprio estabelecimento.
4. Exige clicar em “Usar PIN lido no QR nesta tela” no dispositivo previamente cadastrado. O QR **não autoriza automaticamente** uma tela e nunca inclui o token do Player.
5. A autorização real continua no backend com `auth:client`, assinatura válida e segredo de polling restrito ao aparelho.

O diagnóstico passa a distinguir “Imagem TV”, “Vídeo TV” e “Spot institucional de Rádio”. O registro é uma informação do próprio aparelho, não certificação externa de audiência. Novo teste de contrato de QR/segurança e Rádio incluído; homologação E2E mobile, tela, HTTPS e Player físico ainda pendente.
