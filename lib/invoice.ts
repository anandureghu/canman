import { IClient } from "@/services/interfaces/client.services";
import { TDeliveryResponse } from "@/types/delivery.types";
import { ImageResult } from "expo-image-manipulator";

import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const generateTemplate = async (
  client: IClient,
  deliveryDetails: TDeliveryResponse,
  image: ImageResult
) => {
  // template: https://github.com/sparksuite/simple-html-invoice-template
  const htmlContent = `
      <!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<title>Kalayil Latex & Traders</title>

		<style>
			.invoice-box {
				max-width: 800px;
				margin: auto;
				padding: 30px;
				border: 1px solid #eee;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
				font-size: 16px;
				line-height: 24px;
				font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
				color: #555;
			}

			.invoice-box table {
				width: 100%;
				line-height: inherit;
				text-align: left;
			}

			.invoice-box table td {
				padding: 5px;
				vertical-align: top;
			}

			.invoice-box table tr td:nth-child(2) {
				text-align: right;
			}


      .invoice-box table tr td:nth-child(3) {
				text-align: right;
			}

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 16px;
				line-height: 45px;
				color: #333;
				text-transform: uppercase;
			}

			.invoice-box table tr.information table td {
				padding-bottom: 40px;
			}

			.invoice-box table tr.heading td {
				background: #eee;
				border-bottom: 1px solid #ddd;
				font-weight: bold;
			}

			.invoice-box table tr.details td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.item td {
				border-bottom: 1px solid #eee;
			}

			.invoice-box table tr.item.last td {
				border-bottom: none;
			}

			.invoice-box table tr.total td:nth-child(2) {
				border-top: 2px solid #eee;
				font-weight: bold;
        text-align: right
			}

      .invoice-box table tr.total td:nth-child(1) {
				border-top: 2px solid #eee;
				font-weight: bold;
			}

			@media only screen and (max-width: 600px) {
				.invoice-box table tr.top table td {
					width: 100%;
					display: block;
					text-align: center;
				}

				.invoice-box table tr.information table td {
					width: 100%;
					display: block;
					text-align: center;
				}
			}

			/** RTL **/
			.invoice-box.rtl {
				direction: rtl;
				font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
			}

			.invoice-box.rtl table {
				text-align: right;
			}

			.invoice-box.rtl table tr td:nth-child(2) {
				text-align: left;
			}
		</style>
	</head>

	<body>
		<div class="invoice-box">
			<table cellpadding="0" cellspacing="0">
				<tr class="top">
					<td colspan="3">
						<table>
							<tr>
								<td class="title">
									<div>
										<div>
											<img
												src="data:image/png;base64,${image.base64}"
												style="width: 50px; float: left; margin-right: 20px;" 
											/>
											<span style="font-size: 18px; font-weight: 600;">KALAYIL LATEX , MANNAMANGALAM</span>
										</div>
										<div>
											<h1>Barrel supply and collection reciept</h1>
										</div>
									</div>
								</td>

								<td>
									Invoice #: KLT-${client.id}-${Date.now()}<br />
									Date: ${new Date().toISOString()}<br />
                  Client Type: ${client.type || ""}<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="3">
						<table>
							<tr>
								<td>
                  <strong>Billed To</strong><br />
									${client?.name || " "}<br />
									${client?.phone || " "}<br />
									${client?.address || " "}
								</td>

								<td>
                  <strong>Billed From</strong><br />
									Kalayil Latex & Traders<br />
									Thrissur<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

        <tr class="heading">
					<td>Type</td>
					<td>Quantity</td>
					<td>Date</td>
				</tr>

				${deliveryDetails.deliveries.map((delivery, index) => {
          return `<tr class="item">
                    <td>${delivery.type}</td>
                    <td>${delivery.quantity}</td>
                    <td>${new Date(
                      delivery.updatedAt
                    ).toLocaleDateString()}</td>
                  </tr>`;
        })}

        <tr class="total">
					<td></td>
					<td colspan="2">Total Delivered: ${deliveryDetails.totalSupply}</td>
				</tr>

        <tr class="total">
					<td></td>
					<td colspan="2">Total Collected: ${deliveryDetails.totalCollect}</td>
				</tr>
        
        <tr class="total">
					<td></td>
					<td colspan="2">Pending: ${
            (deliveryDetails.totalSupply || 0) -
            (deliveryDetails.totalCollect || 0)
          }</td>
				</tr>
			</table>
		</div>
	</body>
</html>
    `;

  return htmlContent;
};

export const generatePdf = async (
  client: IClient,
  deliveryDetails: TDeliveryResponse,
  image: ImageResult
) => {
  try {
    const { uri } = await Print.printToFileAsync({
      html: await generateTemplate(client, deliveryDetails!, image),
    });
    if (uri) {
      await Sharing.shareAsync(uri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    }
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
};
