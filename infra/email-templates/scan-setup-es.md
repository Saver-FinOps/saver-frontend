# Email de setup del escaneo — ES

**Asunto:** Signal · setup del rol IAM (5 min)

**Para:** `{{LEAD_EMAIL}}`

**Reply-To:** `signalfinops@gmail.com`

---

Hola {{LEAD_FIRST_NAME_OR_COMPANY}},

Iván de Signal. Recibí tu pedido — esto es el setup para que pueda correr el escaneo en tu cuenta AWS.

## Dos valores que vas a necesitar

| | |
|---|---|
| **AWS account ID de Signal** | `754371202058` |
| **Tu External ID** (único para tu pedido) | `{{EXTERNAL_ID}}` |

## Deployar este template (3 min)

Adjunto: `signal-readonly-role.yaml` (template CloudFormation). También está en <https://github.com/Saver-FinOps/saver-frontend/blob/main/infra/cfn/signal-readonly-role.yaml>.

**Camino más rápido — consola AWS:**

1. AWS Console → CloudFormation → Create stack → With new resources (standard)
2. Upload del archivo YAML
3. Stack name: `signal-readonly-role`
4. Parameters:
   - `SignalAccountId`: `754371202058`
   - `ExternalId`: `{{EXTERNAL_ID}}`
5. Marcá "I acknowledge that AWS CloudFormation might create IAM resources with custom names"
6. Submit. Esperá ~30 segundos.
7. Stack → tab Outputs → copiá el valor de `RoleArn`

**Respondé este mail con el ARN** y corro el escaneo en las próximas 24-48h.

## Qué hace esto

Rol IAM solo lectura. Podemos ver metadata de recursos + Cost Explorer. **No** podemos escribir, borrar, ni leer contenido de S3, bases o secrets. Policy completa: <https://signalfinops.com/es/security>.

Podés borrar el stack en cualquier momento para revocarnos en 10 segundos.

## Dudas

Respondé este mail — lo lee un humano.

— Iván
Signal · Buenos Aires
