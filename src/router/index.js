import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import PantryView from '@/views/PantryView.vue'
import RecipeRecommendView from '@/views/RecipeRecommendView.vue'
import GlucoseReportView from '@/views/GlucoseReportView.vue'
import CommunityView from '@/views/CommunityView.vue'
import NewsView from '@/views/NewsView.vue'
import SearchView from '@/views/SearchView.vue'
import CommentView from '@/views/CommentView.vue'
import MyFamilyView from '@/views/MyFamilyView.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomeView },
    { path: '/pantry', component: PantryView },
    { path: '/recipes', component: RecipeRecommendView },
    { path: '/glucose', component: GlucoseReportView },
    { path: '/community', component: CommunityView },
    { path: '/news', component: NewsView },
    { path: '/search', component: SearchView },
    { path: '/comment', component: CommentView },
    { path: '/family', component: MyFamilyView },
  ],
})

export default router
