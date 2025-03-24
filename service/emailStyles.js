module.exports = `
  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .header { background: #f0f0f0; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  .header h2 { margin-top: 0; color: #e74c3c; }
  .summary { background: #f9f9f9; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
  .account { background: #fff; border: 1px solid #ddd; padding: 15px; margin-bottom: 15px; border-radius: 5px; }
  .account h3 { margin-top: 0; color: #3498db; border-bottom: 1px solid #eee; padding-bottom: 5px; }
  .over-budget { border-left: 5px solid #e74c3c; }
  .approaching-budget { border-left: 5px solid #f39c12; }
  .transactions { margin-top: 10px; }
  .transaction { padding: 8px; border-bottom: 1px solid #eee; }
  .transaction:last-child { border-bottom: none; }
  .amount { font-weight: bold; }
  .over-amount { color: #e74c3c; }
  .footer { text-align: center; margin-top: 20px; font-size: 0.8em; color: #777; }
  .progress-container { height: 20px; background-color: #e0e0e0; border-radius: 10px; margin: 10px 0; }
  .progress-bar { height: 20px; background-color: #3498db; border-radius: 10px; }
  .progress-over { background-color:rgb(231, 33, 11); }
  .progress-warning { background-color: #f39c12; }
`;