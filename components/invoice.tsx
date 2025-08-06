import { colors } from "@/constants/colors";
import { IClient } from "@/services/interfaces/client.services";
import { IDelivery } from "@/services/interfaces/delivery.services";
import * as Print from "expo-print";
import { useFocusEffect } from "expo-router";
import * as Sharing from "expo-sharing";
import React, { useCallback, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Pdf from "react-native-pdf";

import Icon from "react-native-vector-icons/FontAwesome";

interface Props {
  delivery: IDelivery;
  client: IClient;
}
const Invoice = ({ delivery, client }: Props) => {
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

			.invoice-box table tr.top table td {
				padding-bottom: 20px;
			}

			.invoice-box table tr.top table td.title {
				font-size: 45px;
				line-height: 45px;
				color: #333;
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
					<td colspan="2">
						<table>
							<tr>
								<td class="title">
									<h1>INVOICE</h1>
								</td>

								<td>
									Invoice #: ${delivery.id}<br />
									Date: ${new Date().toLocaleDateString()}<br />
								</td>
							</tr>
						</table>
					</td>
				</tr>

				<tr class="information">
					<td colspan="2">
						<table>
							<tr>
								<td>
                  <strong>Billed To</strong><br />
									${client?.name}<br />
									${client?.phone}<br />
									${client?.address}
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

				<tr class="item">
					<td>Quantity</td>
					<td>${delivery?.quantity}</td>
				</tr>
        <tr class="item">
					<td>Delivery Type</td>
					<td>${delivery?.type}</td>
				</tr>
        <tr class="item">
					<td>User Type</td>
					<td>${client?.type}</td>
				</tr>
         <tr class="item">
					<td>Date</td>
					<td>${new Date(delivery?.updatedAt).toLocaleDateString()}</td>
				</tr>
			</table>
		</div>
	</body>
</html>
    `;

  const [uri, setUri] = useState("");

  const sharePdf = async (pdfUri: string) => {
    if (pdfUri) {
      await Sharing.shareAsync(pdfUri, {
        UTI: ".pdf",
        mimeType: "application/pdf",
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      const generatePdf = async () => {
        try {
          const { uri } = await Print.printToFileAsync({
            html: htmlContent,
          });
          setUri(uri);
          return uri;
        } catch (error) {
          console.error("Error generating PDF:", error);
        }
      };
      generatePdf();

      return () => {}; // Optional cleanup
    }, [])
  );

  return (
    <View className="w-fit">
      <TouchableOpacity
        onPress={() => {
          sharePdf(uri);
        }}
      >
        <View className="flex-row items-center justify-center gap-3">
          <Text>Share Invoice</Text>
          <Icon name="share-alt" size={24} color={colors.blue[500]} />
        </View>
      </TouchableOpacity>

      {/* <Pdf
        source={{ uri: uri }}
        onError={(error) => console.error("PDF Error:", error)}
        style={styles.pdf}
      /> */}
    </View>
  );
};

export default Invoice;

const styles = StyleSheet.create({
  pdf: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
