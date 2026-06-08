import { ICredentialType, INodeProperties } from "n8n-workflow";

export class GeekflareApi implements ICredentialType {
  name = "geekflareApi";
  displayName = "Geekflare API";
  documentationUrl = "https://docs.geekflare.com/api/intro";
  properties: INodeProperties[] = [
    {
      displayName: "API Key",
      name: "apiKey",
      type: "string",
      typeOptions: {
        password: true,
      },
      default: "",
      required: true,
      description:
        "Your Geekflare API key. Find it in your Geekflare dashboard.",
    },
  ];
}
