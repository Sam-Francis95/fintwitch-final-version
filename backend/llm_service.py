"""
FinTwitch Real LLM Service
===========================
Provides genuine AI-powered financial insights using real LLM providers:
- OpenAI (GPT-4, GPT-3.5-turbo)
- Ollama (Local models)
- Fallback to intelligent mock

Generates context-aware natural language insights from live financial metrics.
"""

import os
from typing import Dict, List, Any, Optional
from datetime import datetime
import json
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables from .env file in backend folder
env_path = Path(__file__).parent / '.env'
load_dotenv(dotenv_path=env_path)

class LLMService:
    """Real LLM integration for financial intelligence generation"""
    
    def __init__(self):
        self.provider = os.getenv("LLM_PROVIDER", "gemini").lower()
        self.enabled = os.getenv("ENABLE_LLM_INSIGHTS", "true").lower() == "true"
        
        if self.provider == "gemini":
            self._init_gemini()
        elif self.provider == "openai":
            self._init_openai()
        elif self.provider == "ollama":
            self._init_ollama()
        else:
            self.provider = "mock"
            print("INFO: LLM Provider: Mock (set LLM_PROVIDER in .env for real AI)")
    
    def _init_gemini(self):
        """Initialize Google Gemini client using modern google-genai SDK"""
        try:
            from google import genai
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key or api_key == "your_gemini_api_key_here":
                print("INFO: Gemini API key not configured, falling back to mock")
                print("INFO: Get FREE API key at: https://aistudio.google.com/app/apikey")
                self.provider = "mock"
                return
            
            # Initialize modern GenAI client
            self.client = genai.Client(api_key=api_key)
            self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
            self.max_tokens = int(os.getenv("GEMINI_MAX_TOKENS", "500"))
            print(f"+ LLM Provider: Google Gemini ({self.model_name})")
            print("OK Using modern google-genai SDK")
        except ImportError:
            print("INFO: Google GenAI package not installed, falling back to mock")
            print("INFO: Install with: pip install -U google-genai")
            self.provider = "mock"
        except Exception as e:
            print(f"ERROR: Gemini initialization failed: {e}, falling back to mock")
            self.provider = "mock"
    
    def _init_openai(self):
        """Initialize OpenAI client"""
        try:
            from openai import AsyncOpenAI
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key or api_key == "your_openai_api_key_here":
                print("INFO: OpenAI API key not configured, falling back to mock")
                self.provider = "mock"
                return
            
            self.client = AsyncOpenAI(api_key=api_key)
            self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
            self.max_tokens = int(os.getenv("OPENAI_MAX_TOKENS", "500"))
            print(f"+ LLM Provider: OpenAI ({self.model})")
        except ImportError:
            print("INFO: OpenAI package not installed, falling back to mock")
            self.provider = "mock"
        except Exception as e:
            print(f"ERROR: OpenAI initialization failed: {e}, falling back to mock")
            self.provider = "mock"
    
    def _init_ollama(self):
        """Initialize Ollama client"""
        try:
            import httpx
            self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
            self.model = os.getenv("OLLAMA_MODEL", "llama3.2")
            self.client = httpx.Client(base_url=self.base_url, timeout=30.0)
            
            # Test connection
            response = self.client.get("/api/tags")
            if response.status_code == 200:
                print(f"+ LLM Provider: Ollama ({self.model})")
            else:
                raise ConnectionError("Ollama not responding")
        except Exception as e:
            print(f"??  Ollama initialization failed: {e}, falling back to mock")
            self.provider = "mock"
    
    async def generate_financial_insights(
        self,
        metrics: Dict[str, Any],
        intelligence: Dict[str, Any],
        categories: Dict[str, Any],
        advanced_analytics: Dict[str, Any] = None,
        predictions: Dict[str, Any] = None,
        external_signals: Dict[str, Any] = None,
        fusion_metrics: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Generate comprehensive financial insights from live PROCESSED ANALYTICS
        
        IMPORTANT: LLM receives structured analytics, NOT raw transaction data
        
        Args:
            metrics: Core financial metrics (balance, income, expenses, etc.)
            intelligence: Rule-based intelligence (alerts, warnings, risk level)
            categories: Category breakdown data
            advanced_analytics: Streaming transformations (velocity, trends, anomalies)
            predictions: Forward-looking projections
            external_signals: Market/economic context
            fusion_metrics: Multi-source risk fusion
        
        Returns:
            Dict with summary, risk_analysis, recommendations, confidence
        """
        if not self.enabled:
            return self._mock_insights(metrics, intelligence)
        
        if self.provider == "gemini":
            return await self._generate_gemini_insights(
                metrics, intelligence, categories, 
                advanced_analytics, predictions, external_signals, fusion_metrics
            )
        elif self.provider == "openai":
            return await self._generate_openai_insights(
                metrics, intelligence, categories,
                advanced_analytics, predictions, external_signals, fusion_metrics
            )
        elif self.provider == "ollama":
            return await self._generate_ollama_insights(
                metrics, intelligence, categories,
                advanced_analytics, predictions, external_signals, fusion_metrics
            )
        else:
            return self._mock_insights(metrics, intelligence)
    
    def _build_context_prompt(
        self,
        metrics: Dict[str, Any],
        intelligence: Dict[str, Any],
        categories: Dict[str, Any],
        advanced_analytics: Dict[str, Any] = None,
        predictions: Dict[str, Any] = None,
        external_signals: Dict[str, Any] = None,
        fusion_metrics: Dict[str, Any] = None
    ) -> str:
        """Build enhanced prompt with PROCESSED ANALYTICS (not raw data)"""
        
        # Format category spending
        top_categories = sorted(
            [(k, v.get('expenses', 0)) for k, v in categories.items()],
            key=lambda x: x[1],
            reverse=True
        )[:3]
        category_text = ", ".join([f"{cat}: Rupee {amt:.0f}" for cat, amt in top_categories if amt > 0])
        
        # Build enhanced prompt with analytics
        prompt = f"""You are a financial advisor AI analyzing REAL-TIME PROCESSED FINANCIAL ANALYTICS.

CURRENT FINANCIAL STATE:
- Balance: Rupee {metrics.get('balance', 0):.2f}
- Total Income: Rupee {metrics.get('total_income', 0):.2f}
- Total Expenses: Rupee {metrics.get('total_expenses', 0):.2f}
- Transactions: {metrics.get('transaction_count', 0)}
- Financial Health Score: {metrics.get('financial_health_score', 0):.1f}/100

RISK ASSESSMENT:
- Risk Level: {intelligence.get('risk_level', 'UNKNOWN')}
- Active Alerts: {len(intelligence.get('alerts', []))}
- Active Warnings: {len(intelligence.get('warnings', []))}"""

        # Add advanced analytics if available
        if advanced_analytics:
            prompt += f"""

STREAMING ANALYTICS:
- Spending Velocity: Rupee {advanced_analytics.get('spending_velocity', 0):.2f}/minute
- Trend: {advanced_analytics.get('trend', 'stable').upper()}
- Spending Pattern: {advanced_analytics.get('spending_pattern', 'normal')}
- Anomaly Detected: {'YES' if advanced_analytics.get('anomaly_detected') else 'NO'}"""

        # Add predictions if available
        if predictions:
            days_zero = predictions.get('days_until_zero_balance')
            prompt += f"""

PREDICTIVE INSIGHTS:
- Balance Depletion: {f"In {days_zero} days" if days_zero else "Not at risk"}
- Daily Burn Rate: Rupee {predictions.get('burn_rate_per_day', 0):.2f}
- Projected Monthly Deficit: Rupee {predictions.get('projected_monthly_deficit', 0):.2f}
- Recommended Daily Budget: Rupee {predictions.get('recommended_daily_budget', 0):.2f}"""

        # Add external context if available
        if external_signals:
            prompt += f"""

EXTERNAL MARKET CONDITIONS:
- Market Sentiment: {external_signals.get('market_sentiment', 0.5):.2f} (0=bearish, 1=bullish)
- Market Volatility: {external_signals.get('market_volatility', 0):.2f}
- Interest Rate: {external_signals.get('interest_rate', 0):.1f}%
- Inflation Rate: {external_signals.get('inflation_rate', 0):.1f}%"""

        # Add fusion metrics if available
        if fusion_metrics:
            prompt += f"""

MULTI-SOURCE RISK ANALYSIS:
- Overall Financial Risk: {fusion_metrics.get('overall_financial_risk', 0):.0f}/100
- Market-Adjusted Health: {fusion_metrics.get('market_adjusted_health', 0):.0f}/100
- Recommended Action: {fusion_metrics.get('recommended_action', 'monitor').replace('_', ' ').title()}"""

        prompt += f"""

TOP SPENDING CATEGORIES:
{category_text if category_text else "No spending data yet"}

ALERTS & WARNINGS:
{chr(10).join(['- ' + alert for alert in intelligence.get('alerts', [])[:3]])}
{chr(10).join(['- ' + warning for warning in intelligence.get('warnings', [])[:2]])}

TASK: Provide a concise financial analysis with:
1. A brief summary (2-3 sentences) considering all analytics including trends and predictions
2. Risk analysis explaining the current risk level using ALL available data sources
3. 3-4 specific, actionable recommendations based on trends, predictions, and market conditions

Be direct, practical, and data-driven. Use Indian Rupee (Rupee ) format."""
        
        return prompt
    
    async def _generate_gemini_insights(
        self,
        metrics: Dict[str, Any],
        intelligence: Dict[str, Any],
        categories: Dict[str, Any],
        advanced_analytics: Dict[str, Any] = None,
        predictions: Dict[str, Any] = None,
        external_signals: Dict[str, Any] = None,
        fusion_metrics: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Generate insights using Google Gemini API with modern SDK"""
        try:
            prompt = self._build_context_prompt(
                metrics, intelligence, categories,
                advanced_analytics, predictions, external_signals, fusion_metrics
            )
            
            # Generate content with modern GenAI client (async)
            response = await self.client.aio.models.generate_content(
                model=self.model_name,
                contents=prompt
            )
            
            content = response.text
            
            # Parse response into structured format
            return self._parse_llm_response(content, metrics, intelligence)
            
        except Exception as e:
            print(f"? Gemini API error: {e}")
            return self._mock_insights(metrics, intelligence)
    
    async def _generate_openai_insights(
        self,
        metrics: Dict[str, Any],
        intelligence: Dict[str, Any],
        categories: Dict[str, Any],
        advanced_analytics: Dict[str, Any] = None,
        predictions: Dict[str, Any] = None,
        external_signals: Dict[str, Any] = None,
        fusion_metrics: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Generate insights using OpenAI API"""
        try:
            prompt = self._build_context_prompt(
                metrics, intelligence, categories,
                advanced_analytics, predictions, external_signals, fusion_metrics
            )
            
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful financial advisor providing concise, actionable advice based on real-time transaction data."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                max_tokens=self.max_tokens,
                temperature=0.7,
            )
            
            content = response.choices[0].message.content
            
            # Parse response into structured format
            return self._parse_llm_response(content, metrics, intelligence)
            
        except Exception as e:
            print(f"? OpenAI API error: {e}")
            return self._mock_insights(metrics, intelligence)
    
    async def _generate_ollama_insights(
        self,
        metrics: Dict[str, Any],
        intelligence: Dict[str, Any],
        categories: Dict[str, Any],
        advanced_analytics: Dict[str, Any] = None,
        predictions: Dict[str, Any] = None,
        external_signals: Dict[str, Any] = None,
        fusion_metrics: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """Generate insights using Ollama local LLM"""
        try:
            prompt = self._build_context_prompt(
                metrics, intelligence, categories,
                advanced_analytics, predictions, external_signals, fusion_metrics
            )
            
            response = self.client.post(
                "/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False
                }
            )
            
            if response.status_code == 200:
                content = response.json().get("response", "")
                return self._parse_llm_response(content, metrics, intelligence)
            else:
                raise Exception(f"Ollama returned status {response.status_code}")
                
        except Exception as e:
            print(f"? Ollama API error: {e}")
            return self._mock_insights(metrics, intelligence)
    
    def _parse_llm_response(
        self,
        content: str,
        metrics: Dict[str, Any],
        intelligence: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Parse LLM text response into structured format"""
        
        # Split by sections
        lines = content.strip().split('\n')
        summary_lines = []
        risk_lines = []
        rec_lines = []
        
        current_section = "summary"
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
            
            # Detect section headers
            lower_line = line.lower()
            if "risk" in lower_line and ("analysis" in lower_line or "assessment" in lower_line):
                current_section = "risk"
                continue
            elif "recommendation" in lower_line or "advice" in lower_line:
                current_section = "recommendations"
                continue
            
            # Add to appropriate section
            if current_section == "summary":
                summary_lines.append(line)
            elif current_section == "risk":
                risk_lines.append(line)
            elif current_section == "recommendations":
                # Extract bullet points or numbered lists
                if line.startswith(('1.', '2.', '3.', '4.', '-', '*', '*')):
                    # Clean up numbering/bullets
                    rec_lines.append(line.lstrip('1234567890.-** '))
        
        # Combine sections
        summary = ' '.join(summary_lines[:3]) if summary_lines else "Financial analysis in progress."
        risk_analysis = ' '.join(risk_lines[:2]) if risk_lines else f"Risk level is {intelligence.get('risk_level', 'MEDIUM')}."
        recommendations = rec_lines[:4] if rec_lines else ["Monitor your spending closely", "Track expenses by category"]
        
        return {
            "summary": summary,
            "risk_analysis": risk_analysis,
            "recommendations": recommendations,
            "confidence": 0.92,  # High confidence for real LLM
            "generated_at": datetime.now().isoformat(),
            "provider": self.provider,
            "model": getattr(self, 'model', 'mock')
        }
    
    def _mock_insights(
        self,
        metrics: Dict[str, Any],
        intelligence: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Intelligent mock insights when real LLM unavailable"""
        
        balance = metrics.get('balance', 0)
        income = metrics.get('total_income', 0)
        expenses = metrics.get('total_expenses', 0)
        health_score = metrics.get('financial_health_score', 0)
        risk_level = intelligence.get('risk_level', 'MEDIUM')
        
        # Generate contextual summary
        if balance < 0:
            summary = f"?? Critical: Your account is overdrawn by Rupee {abs(balance):.2f}. Expenses (Rupee {expenses:.2f}) have exceeded income (Rupee {income:.2f})."
        elif expenses > income:
            summary = f"?? High risk: Expenses (Rupee {expenses:.2f}) exceed income (Rupee {income:.2f}) by Rupee {expenses - income:.2f}. Current balance: Rupee {balance:.2f}."
        elif balance < 5000:
            summary = f"? Low balance warning: Only Rupee {balance:.2f} remaining. You've earned Rupee {income:.2f} and spent Rupee {expenses:.2f}."
        else:
            summary = f"OK Stable finances: Balance of Rupee {balance:.2f} with healthy income (Rupee {income:.2f}) vs expenses (Rupee {expenses:.2f})."
        
        # Risk explanation
        expense_ratio = (expenses / max(income, 1)) * 100
        risk_explanations = {
            "CRITICAL": f"Risk is CRITICAL because your expense ratio is {expense_ratio:.0f}% (should be <80%). Immediate action required.",
            "HIGH": f"Risk is HIGH because expenses represent {expense_ratio:.0f}% of income. Reduce spending to stabilize.",
            "MEDIUM": f"Risk is MEDIUM. Your finances are manageable but watch for expense creep. Current ratio: {expense_ratio:.0f}%.",
            "LOW": f"Risk is LOW. You're maintaining healthy financial habits with {expense_ratio:.0f}% expense ratio."
        }
        risk_analysis = risk_explanations.get(risk_level, "Monitor your financial health regularly.")
        
        # Context-aware recommendations
        recommendations = []
        if balance < 0:
            recommendations.append("? Priority 1: Stop all non-essential spending immediately")
            recommendations.append("? Priority 2: Identify income sources to cover overdraft")
        elif expenses > income:
            recommendations.append("? Priority: Reduce discretionary spending by 20-30%")
            recommendations.append("? Analyze top spending categories and set limits")
        elif balance < 5000:
            recommendations.append("? Build emergency fund to Rupee 15,000 minimum")
            recommendations.append("? Reduce expenses to save Rupee 2,000-3,000 monthly")
        else:
            recommendations.append("OK Continue current spending habits")
            recommendations.append("? Consider allocating 10-20% to savings/investments")
        
        recommendations.append("? Track spending by category weekly")
        recommendations.append("? Set monthly budget limits")
        
        return {
            "summary": summary,
            "risk_analysis": risk_analysis,
            "recommendations": recommendations[:4],
            "confidence": 0.85,
            "generated_at": datetime.now().isoformat(),
            "provider": "mock_intelligent",
            "model": "rule-based"
        }
    
    # Synchronous wrapper for non-async contexts
    def generate_insights_sync(
        self,
        metrics: Dict[str, Any],
        intelligence: Dict[str, Any],
        categories: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Synchronous version for compatibility"""
        import asyncio
        try:
            loop = asyncio.get_event_loop()
        except RuntimeError:
            loop = asyncio.new_event_loop()
            asyncio.set_event_loop(loop)
        
        return loop.run_until_complete(
            self.generate_financial_insights(metrics, intelligence, categories)
        )


# Global instance
_llm_service = None

def get_llm_service() -> LLMService:
    """Get or create global LLM service instance"""
    global _llm_service
    if _llm_service is None:
        _llm_service = LLMService()
    return _llm_service
