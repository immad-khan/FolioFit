from django.urls import path
from . import views

urlpatterns = [
    # POST: /api/skill-roadmap/generate/ -> Generates a new personalized roadmap via Groq LLM
    path('generate/', views.GenerateRoadmapView.as_view(), name='generate-roadmap'),
    
    # GET: /api/skill-roadmap/list/ -> Lists all active roadmaps of the user
    path('list/', views.UserRoadmapListView.as_view(), name='list-roadmaps'),
    
    # GET/PATCH: /api/skill-roadmap/<uuid:pk>/ -> Get roadmap detail or update skill completion status
    path('<uuid:pk>/', views.UserRoadmapDetailView.as_view(), name='roadmap-detail'),
    
    # POST: /api/skill-roadmap/chat/ -> Context-aware chatbot assistant for the learning roadmap
    path('chat/', views.SkillBotChatView.as_view(), name='skillbot-chat'),
]
