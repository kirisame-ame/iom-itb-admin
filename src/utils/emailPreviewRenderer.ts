type EmailPreviewOptions = {
  title: string
  bodyText: string
  logoBlueUrl: string
  logoWhiteUrl: string
  maxWidth?: number
}

export const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

export const linkify = (escaped: string) =>
  escaped.replace(/(https?:\/\/[^\s<>&"]+)/g, url =>
    `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;word-break:break-all;">${url}</a>`
  )

export const textToHtmlParagraphs = (text: string) =>
  text
    .split('\n')
    .map(line => line.trim()
      ? `<p style="margin:0 0 12px;">${linkify(escapeHtml(line))}</p>`
      : '<br />'
    )
    .join('')

export const buildPreviewFooterHtml = (logoBlueUrl: string) => `
  <div style="margin-top:24px;height:1px;background:#e5e7eb;"></div>
  <div style="padding-top:20px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td style="width:30%;vertical-align:middle;text-align:left;">
          <img src="${logoBlueUrl}" alt="IOM ITB" style="max-width:110px;height:auto;display:block;" />
        </td>
        <td style="width:40%;vertical-align:middle;text-align:center;">
          <p style="margin:0;font-size:14px;color:#6b7280;font-weight:500;">Ikatan Orangtua Mahasiswa ITB</p>
        </td>
        <td style="width:30%;vertical-align:middle;text-align:right;white-space:nowrap;">
          <a href="https://www.iom-itb.id/" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-left:10px;">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/googlechrome.svg" alt="Website" width="20" height="20" style="vertical-align:middle;" />
          </a>
          <a href="https://www.instagram.com/iom_itb/" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-left:10px;">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/instagram.svg" alt="Instagram" width="20" height="20" style="vertical-align:middle;" />
          </a>
          <a href="https://www.youtube.com/@IOM-ITB" target="_blank" rel="noopener noreferrer" style="display:inline-block;margin-left:10px;">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/youtube.svg" alt="YouTube" width="20" height="20" style="vertical-align:middle;" />
          </a>
        </td>
      </tr>
    </table>
  </div>`

export const buildEmailPreviewDocument = ({
  title,
  bodyText,
  logoBlueUrl,
  logoWhiteUrl,
  maxWidth = 600,
}: EmailPreviewOptions) => `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>body { margin: 20px; background: #f9fafb; }</style>
</head>
<body>
  <div style="font-family: Arial, sans-serif; font-size: 14px; max-width: ${maxWidth}px; margin: 0 auto; color: #222;">
    <div style="background: #2563eb; color: #fff; padding: 20px 24px; border-radius: 8px 8px 0 0; text-align: center;">
      <img src="${logoWhiteUrl}" alt="IOM ITB" style="max-width: 180px; height: auto; margin: 0 auto 16px; display: block;" />
      <h1 style="margin: 0; font-size: 20px; font-family: Arial, sans-serif; font-weight: 700;">${escapeHtml(title)}</h1>
      <p style="margin: 4px 0 0; font-size: 13px; opacity: 0.9;">IOM ITB</p>
    </div>
    <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px; background: #fff;">
      ${textToHtmlParagraphs(bodyText)}
      <p style="margin: 24px 0 8px; font-size: 12px; color: #9ca3af; text-align: center;">
        Email ini dikirim otomatis, mohon tidak membalas email ini.
      </p>
      ${buildPreviewFooterHtml(logoBlueUrl)}
    </div>
  </div>
</body>
</html>`
