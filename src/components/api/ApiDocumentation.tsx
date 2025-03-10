import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Mail, Database, Server } from "lucide-react";

interface ApiEndpoint {
  name: string;
  description: string;
  method: string;
  path: string;
  icon: React.ReactNode;
  requestExample: string;
  responseExample: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
  }[];
}

const apiEndpoints: ApiEndpoint[] = [
  {
    name: "Title Generation",
    description: "Generate SEO-optimized titles for your content",
    method: "Feature",
    path: "Generate engaging, click-worthy titles",
    icon: <FileJson className="h-5 w-5 text-blue-600" />,
    requestExample: `// In the desktop app:
// 1. Upload or paste your content
// 2. Select "Generate Title" option
// 3. Configure settings (length, style, etc.)
// 4. Click Generate`,
    responseExample: `{
  "title": "10 Proven Strategies to Boost Your Content Marketing ROI",
  "alternatives": [
    "Maximize Your Content Marketing: 10 ROI-Boosting Tactics",
    "The Ultimate Guide to Improving Content Marketing Returns"
  ]
}`,
    parameters: [
      {
        name: "content",
        type: "string",
        required: true,
        description: "The content to generate a title for",
      },
      {
        name: "style",
        type: "string",
        required: false,
        description: "Title style (informative, engaging, etc.)",
      },
    ],
  },
  {
    name: "Keyword Extraction",
    description: "Extract relevant keywords from your content",
    method: "Feature",
    path: "Identify high-value SEO keywords",
    icon: <Key className="h-5 w-5 text-blue-600" />,
    requestExample: `// In the desktop app:
// 1. Upload or paste your content
// 2. Select "Extract Keywords" option
// 3. Set number of keywords to extract
// 4. Click Generate`,
    responseExample: `{
  "keywords": [
    { "keyword": "content marketing", "relevance": 0.95 },
    { "keyword": "ROI", "relevance": 0.87 },
    { "keyword": "marketing strategy", "relevance": 0.82 },
    { "keyword": "digital marketing", "relevance": 0.78 }
  ]
}`,
    parameters: [
      {
        name: "content",
        type: "string",
        required: true,
        description: "The content to extract keywords from",
      },
      {
        name: "maxKeywords",
        type: "number",
        required: false,
        description: "Maximum number of keywords to extract",
      },
    ],
  },
  {
    name: "Description Generation",
    description: "Create compelling meta descriptions for SEO",
    method: "Feature",
    path: "Generate concise, engaging descriptions",
    icon: <FileJson className="h-5 w-5 text-blue-600" />,
    requestExample: `// In the desktop app:
// 1. Upload or paste your content
// 2. Select "Generate Description" option
// 3. Set desired length (recommended: 150-160 characters)
// 4. Click Generate`,
    responseExample: `{
  "description": "Discover 10 proven strategies to maximize your content marketing ROI. Learn how to measure, optimize, and scale your content efforts for better results.",
  "characterCount": 158
}`,
    parameters: [
      {
        name: "content",
        type: "string",
        required: true,
        description: "The content to generate a description for",
      },
      {
        name: "maxLength",
        type: "number",
        required: false,
        description: "Maximum character length for the description",
      },
    ],
  },
];

export default function ApiDocumentation() {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-4">Metadata Generation Guide</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Learn how to use our Mistral AI-powered metadata generation service to
          create optimized titles, keywords, and descriptions for your content.
        </p>
      </div>

      <div className="mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              <CardTitle>Getting Started with MetaGen AI</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Authentication</h3>
                <p className="text-gray-600 mb-2">
                  Access to our metadata generation service requires
                  authentication. Active subscribers can use our desktop app
                  which handles authentication automatically.
                </p>
                <pre className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  <code>// The desktop app manages authentication for you</code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Desktop App</h3>
                <p className="text-gray-600 mb-2">
                  Our Electron desktop app provides the most convenient way to
                  generate metadata in batch:
                </p>
                <pre className="bg-gray-100 p-3 rounded-md font-mono text-sm overflow-x-auto">
                  <code>
                    Available for Windows, macOS, and Linux with active
                    subscription
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="font-medium mb-2">Output Formats</h3>
                <p className="text-gray-600 mb-2">
                  Generated metadata can be exported in multiple formats
                  including CSV, JSON, and Excel for easy integration with your
                  workflow.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {apiEndpoints.map((endpoint) => (
          <Card key={endpoint.name} className="overflow-hidden">
            <CardHeader className="border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {endpoint.icon}
                  <CardTitle>{endpoint.name}</CardTitle>
                </div>
                <Badge
                  className={`${endpoint.method === "GET" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
                >
                  {endpoint.method}
                </Badge>
              </div>
              <p className="text-gray-600 mt-2">{endpoint.description}</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-sm text-gray-800 mt-4">
                {endpoint.path}
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="parameters">
                <TabsList className="mb-4">
                  {endpoint.parameters && endpoint.parameters.length > 0 && (
                    <TabsTrigger value="parameters">Parameters</TabsTrigger>
                  )}
                  <TabsTrigger value="request">Request Example</TabsTrigger>
                  <TabsTrigger value="response">Response Example</TabsTrigger>
                </TabsList>

                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <TabsContent value="parameters">
                    <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Parameter
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Required
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {endpoint.parameters.map((param) => (
                            <tr key={param.name}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {param.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {param.type}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {param.required ? (
                                  <Badge
                                    variant="outline"
                                    className="bg-red-50 text-red-700 border-red-200"
                                  >
                                    Required
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="bg-gray-50 text-gray-700 border-gray-200"
                                  >
                                    Optional
                                  </Badge>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                {param.description}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="request">
                  <pre className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <code>{endpoint.requestExample}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="response">
                  <pre className="bg-gray-100 p-4 rounded-md font-mono text-sm overflow-x-auto">
                    <code>{endpoint.responseExample}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
