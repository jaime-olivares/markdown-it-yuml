"use strict";

const yuml_diagram = require('yuml-diagram');

export function diagramPlugin(md, options) 
{
    // Store reference to original renderer.
    var defaultFenceRenderer = md.renderer.rules.fence;

    // Render custom code types as SVGs, letting the fence parser do all the heavy lifting.
    function customFenceRenderer(tokens, idx, options, env, self) 
    {
        var token = tokens[idx];
        var info = token.info.trim();
        var langName = info ? info.split(/\s+/g)[0] : "";
        var yuml = new yuml_diagram();

        // Only handle custom token
        if (langName == "yuml") 
        {
            try {
                var svg = yuml.processYumlDocument(token.content, false);
                var svg_div = `<div class="markdown-yuml">${svg}</div>`;
                return svg_div;
            }
            catch (e) {
                console.log("Error in running yuml-diagram:" + e);
            }
        }
        else
        {
            return defaultFenceRenderer(tokens, idx, options, env, self);
        }

        return "<div></div>";
    }

    md.renderer.rules.fence = customFenceRenderer;
}
