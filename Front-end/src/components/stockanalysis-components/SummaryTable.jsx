import React from 'react';

const SummaryTable = ({ summary, responseDepth }) => {
    if (responseDepth !== 'detailed') {
        // Summary is printed as normal for quick summary (detailed summary button is off)
        return <p className="m-0">{summary}</p>;
    }

    const summaryLines = summary.trim().split("\n");

    const hasSixthLine = summaryLines[summaryLines.length - 1].startsWith("6.");
    let firstSentence = summaryLines[0];
    let lastSentence = hasSixthLine ? null : summaryLines[summaryLines.length - 1];
    let middleLines = hasSixthLine ? summaryLines.slice(1) : summaryLines.slice(1, -1);

    // Rendering the table when in detailed mode (detailed summary button is on)
    const summaryRows = middleLines.map((line, index) => {
        const [consideration, analysis] = line.split(": ");
        return consideration && analysis ? (
            <tr key={index}>
                <td style={{ border: '1px solid #C3C3C3', padding: '8px' }}>{consideration.trim()}</td>
                <td style={{ border: '1px solid #C3C3C3', padding: '8px' }}>{analysis.trim()}</td>
            </tr>
        ) : null;
    });

    // If the line starts with 6., add it to the table 
    if (hasSixthLine) {
        const [consideration, analysis] = summaryLines[summaryLines.length - 1].split(": ");
        if (consideration && analysis) {
            summaryRows.push(
                <tr key={summaryRows.length}>
                    <td style={{ border: '1px solid #C3C3C3', padding: '8px' }}>{consideration.trim()}</td>
                    <td style={{ border: '1px solid #C3C3C3', padding: '8px' }}>{analysis.trim()}</td>
                </tr>
            );
        }
    }

    return (
        <div>
            <p>{firstSentence}</p>
            <table style={{ borderCollapse: 'collapse', width: '100%', borderRadius:"30px" }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #C3C3C3', padding: '8px', backgroundColor:"#D9D9D9" }}>Investment Consideration</th>
                        <th style={{ border: '1px solid #C3C3C3', padding: '8px', backgroundColor:"#D9D9D9" }}>Analysis</th>
                    </tr>
                </thead>
                <tbody>
                    {summaryRows}
                </tbody>
            </table>
            <br />
            {lastSentence && <p>{lastSentence}</p>}
        </div>
    );
};

export default SummaryTable;
